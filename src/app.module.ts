import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './configs/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(typeormConfig)],
})
export class AppModule {}
