import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BoldController } from './bold.controller';
import { BoldService } from './bold.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ConfigModule, PrismaModule, EmailModule],
  controllers: [BoldController],
  providers: [BoldService],
})
export class BoldModule {}
