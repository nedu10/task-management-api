import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get_user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskStatusValidator } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './tasks.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksServices: TasksService) {}

  @Get()
  get_filter_task(
    @Query(ValidationPipe) filterDto: TaskFilterDto,
  ): Promise<object> {
    return this.tasksServices.get_task_with_filter(filterDto);
  }

  //   @Get()
  //   get_all_task(): Task[] {
  //     return this.tasksServices.get_all_task();
  //   }

  @Get('/:id')
  get_task_by_id(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.tasksServices.get_task_by_id(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create_task(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<object> {
    return this.tasksServices.create_task(createTaskDto, user);
  }
  @Delete('/:id')
  delete_task(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.tasksServices.delete_task(id);
  }
  @Patch('/:id/status')
  update_task(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidator) status: TaskStatus,
  ): Promise<object> {
    return this.tasksServices.update_task(id, status);
  }
}
