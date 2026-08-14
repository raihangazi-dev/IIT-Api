import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import type { Request, Response } from 'express';

const expressServer = express();
let app: ReturnType<typeof NestFactory.create> extends Promise<infer T> ? T : never;
let isReady = false;

async function bootstrap() {
  if (isReady) return;
  app = await NestFactory.create(AppModule, new ExpressAdapter(expressServer), {
    logger: ['error', 'warn'],
  });
  app.enableCors({
    origin: [process.env.WEB_APP_URL ?? 'http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api');
  await app.init();
  isReady = true;
}

export default async function handler(req: Request, res: Response) {
  await bootstrap();
  expressServer(req, res);
}
