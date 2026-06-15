import { Body, Headers, Controller, Post, Get, Param } from '@nestjs/common';

import { BoldService } from './bold.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as boldWebhookDto from './dto/bold-webhook.dto';

@Controller('bold')
export class BoldController {
  constructor(private readonly boldService: BoldService) {}

  @Post('create-order')
  createOrder(@Body() dto: CreateOrderDto) {
    console.log('Received request to create order with data:', dto);
    return this.boldService.createOrder(dto);
  }
  @Get('order/:reference')
  getOrder(@Param('reference') reference: string) {
    return this.boldService.getOrder(reference);
  }
  @Post('webhook')
  webhook(@Body() body: boldWebhookDto.BoldWebhookDto) {
    return this.boldService.processWebhook(body);
  }
}
