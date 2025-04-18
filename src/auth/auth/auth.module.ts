import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/register';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[TypeOrmModule.forFeature([Auth]),JwtModule.register({
    global: true,
    secret: process.env.secret,
    signOptions: { expiresIn: '1d' },
  }),],
  
})
export class AuthModule {}
