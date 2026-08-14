import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { AlumniModule } from './alumni/alumni.module';

@Module({
  imports: [PrismaModule, EmailModule, AuthModule, AlumniModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
