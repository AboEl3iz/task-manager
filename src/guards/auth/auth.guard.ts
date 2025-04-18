import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
 async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
     throw new HttpException('Unauthorized', 401);
      
      
    }
    try {
      const payload = await this.jwtService.verify(token, { secret: process.env.secret });
      console.log(payload);
      request['user'] = payload;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
      
    }
    
    return true;
  }
}
