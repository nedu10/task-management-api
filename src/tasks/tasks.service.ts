import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.enum';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}
  //   private task: Task[] = [];
  //   get_all_task(): Task[] {
  //     return this.task;
  //   }
  //   get_task_with_filter(filterDto: TaskFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     let get_task = this.get_all_task();
  //     if (status) {
  //       get_task = get_task.filter((el) => el.status == status);
  //     }
  //     if (search) {
  //       get_task = get_task.filter(
  //         (el) => el.title.includes(search) || el.description.includes(search),
  //       );
  //     }
  //     return get_task;
  //   }
  async get_task_with_filter(filterDto: TaskFilterDto): Promise<object> {
    try {
      let get_task = await this.taskRepository.getTasks(filterDto);
      return {
        status_code: 200,
        status: 'success',
        message: 'task retrived',
        data: get_task,
      };
    } catch (error) {
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }
  async get_task_by_id(id: number): Promise<object> {
    try {
      const data = await this.taskRepository.findOne(id);
      if (!data) {
        return new NotFoundException(`Task with id: ${id} not found`);
      }
      return {
        status_code: 200,
        status: 'success',
        message: 'task retrived',
        data,
      };
    } catch (error) {
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }
  async create_task(createTaskDto: CreateTaskDto, user: User): Promise<object> {
    const data = await this.taskRepository.createTask(createTaskDto, user);
    return {
      status_code: 201,
      status: 'success',
      message: 'Successfully created task',
      data,
    };
  }
  async update_task(id: number, status: TaskStatus): Promise<object> {
    try {
      const get_task = await this.taskRepository.findOne(id);
      if (!get_task) {
        throw new NotFoundException(`Task with id: ${id} not found`);
      }
      get_task.status = status;
      await get_task.save();
      return {
        status_code: 202,
        status: 'success',
        message: 'task updates',
        data: get_task,
      };
    } catch (error) {
      console.log(error);
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }
  async delete_task(id: number): Promise<object> {
    // const get_task = await this.taskRepository.findOne(id);
    // await this.taskRepository.remove(get_task);
    try {
      const delete_task = await this.taskRepository.delete(id); //delet all the result which match the id
      if (delete_task.affected === 0) {
        return new NotFoundException(`Task with id: ${id} not found`);
      }
      return {
        status_code: 200,
        status: 'success',
        message: 'task deleted',
      };
    } catch (error) {
      console.log(error);
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }
}
