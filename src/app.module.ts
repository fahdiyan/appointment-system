import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [AppointmentModule, ConfigModule],
    providers: [PrismaService],
})
export class AppModule {}
