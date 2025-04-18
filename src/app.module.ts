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
  imports: [ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TaskModule,
    TodoModule,
    TypeOrmModule.forRoot({
      logging: ["query", "error"],
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
      entities:[Auth,Task,Todo]
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
