import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser());
  // app.setGlobalPrefix('api/v1');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const allowedOrigins = [
    'https://www.admasterlk.com',
    'https://admasterlk.com',
    'https://admin.admasterlk.com',
    'https://www.admin.admasterlk.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.enableCors({
    // origin: (origin, callback) => {
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://www.admasterlk.com',
      'https://admasterlk.com',
      'https://admin.admasterlk.com',
      'https://www.admin.admasterlk.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
