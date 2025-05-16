import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth/auth.module';
import { UserModule } from './user/user/user.module';
import { Auth } from './auth/auth/entities/register';
import { Task } from './tasks/task/entities/task.entity';
import { Todo } from './tasks/todo/entities/todo.entity';
import { TaskModule } from './tasks/task/task.module';
import { TodoModule } from './tasks/todo/todo.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    AuthModule,
    UserModule,
    TaskModule,
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '2832003',
      database: process.env.POSTGRES_DB || 'nestdb',
      entities: [Auth, Task, Todo],
      synchronize: true, // Set to false in production
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
