import { Body, Controller, Post, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  getHello(): string {
    return 'ProClean API';
  }

  @Post()
  async createReservation(@Body() emailDto: EmailDto) {
    await this.emailService.sendReservationEmail(emailDto);

    try {
      await this.emailService.sendCustomerConfirmation(emailDto);
      console.log('Email de confirmación enviado al cliente:', emailDto.correo);
      console.log('Detalles de la reserva:', emailDto.planServicio);
    } catch (error) {
      console.error(
        'Error al enviar el email de confirmación al cliente:',
        error,
      );
      throw error;
    }

    return {
      success: true,
      message: 'Reserva recibida',
    };
  }
}
