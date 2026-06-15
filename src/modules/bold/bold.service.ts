/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { CreateOrderDto } from './dto/create-order.dto';
import { BoldWebhookDto } from './dto/bold-webhook.dto';
import { calculatePrice } from './utils/pricing';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { Status, Prisma } from '@prisma/client';
import { ReservationDataDto } from './dto/reservation-data.dto';

@Injectable()
export class BoldService {
  private readonly logger = new Logger(BoldService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    try {
      const { secretKey, publicKey } = this.getPaymentConfig();

      const reference = this.generateReference();

      const pricing = calculatePrice(dto.fechas.length, dto.planServicio);

      const amount = Math.round(pricing.finalPrice);

      const currency = 'COP';

      const integritySignature = this.generateIntegritySignature({
        reference,
        amount,
        currency,
        secretKey,
      });

      await this.saveOrder({
        dto,
        reference,
        amount,
      });

      this.logger.log(`Payment order created successfully: ${reference}`);

      return {
        identityKey: publicKey,
        reference,
        amount,
        currency,
        integritySignature,
      };
    } catch (error) {
      this.logger.error(
        'Failed to create payment order',
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to create payment order');
    }
  }

  async getOrder(reference: string) {
    if (!reference?.trim()) {
      throw new BadRequestException('Order reference is required');
    }

    try {
      const order = await this.prisma.paymentOrder.findUnique({
        where: {
          reference: reference.trim(),
        },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with reference ${reference} not found`,
        );
      }

      return order;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to retrieve order ${reference}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to retrieve order');
    }
  }

  async processWebhook(payload: BoldWebhookDto) {
    console.log('Webhook recibido:', payload);

    const reference = payload?.data?.metadata?.reference;

    if (!reference) {
      return { ok: false, message: 'Reference not found in webhook payload' };
    }

    const order = await this.prisma.paymentOrder.findUnique({
      where: {
        reference,
      },
    });

    if (!order) {
      return { ok: false, message: 'Order not found' };
    }

    if (order.status === Status.APPROVED) {
      return { ok: false, message: 'Order is already approved' };
    }

    switch (payload.type) {
      case 'SALE_APPROVED': {
        await this.prisma.paymentOrder.update({
          where: { reference },
          data: {
            status: Status.APPROVED,
          },
        });

        const emailData = this.parseReservationData(order.reservationData);

        console.log('Tipo:', typeof emailData);
        console.log('Datos:', emailData);
        console.log('Fechas:', emailData.fechas);
        await this.emailService.sendReservationEmail(emailData);

        await this.emailService.sendCustomerConfirmation(emailData);

        this.logger.log(`Order ${reference} approved and emails sent`);

        break;
      }

      case 'SALE_REJECTED': {
        await this.prisma.paymentOrder.update({
          where: {
            reference,
          },
          data: {
            status: Status.REJECTED,
          },
        });

        break;
      }

      default:
        this.logger.warn(`Unhandled webhook event: ${payload.type}`);
    }

    return { ok: true };
  }

  private getPaymentConfig() {
    const secretKey = this.configService.get<string>('BOLD_SECRET_KEY');

    const publicKey = this.configService.get<string>('BOLD_PUBLIC_KEY');

    if (!secretKey || !publicKey) {
      throw new InternalServerErrorException(
        'Payment configuration is missing',
      );
    }

    return {
      secretKey,
      publicKey,
    };
  }

  private generateReference(): string {
    return `PCP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  private generateIntegritySignature({
    reference,
    amount,
    currency,
    secretKey,
  }: {
    reference: string;
    amount: number;
    currency: string;
    secretKey: string;
  }): string {
    return crypto
      .createHash('sha256')
      .update(`${reference}${amount}${currency}${secretKey}`)
      .digest('hex');
  }

  private saveOrder({
    dto,
    reference,
    amount,
  }: {
    dto: CreateOrderDto;
    reference: string;
    amount: number;
  }) {
    console.log(dto.fechas);
    console.log(typeof dto.fechas);
    console.log(Array.isArray(dto.fechas));
    return this.prisma.paymentOrder.create({
      data: {
        reference,
        status: Status.PENDING,

        amount,

        customerName: dto.customerName,
        email: dto.email,
        phone: dto.phone,

        planServicio: dto.planServicio,

        fechas: dto.fechas,

        reservationData:
          dto.reservationData as unknown as Prisma.InputJsonValue,
      },
    });
  }

  private parseReservationData(data: Prisma.JsonValue): ReservationDataDto {
    if (typeof data === 'string') {
      return JSON.parse(data) as ReservationDataDto;
    }

    return data as unknown as ReservationDataDto;
  }
}
