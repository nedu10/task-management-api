import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskEntity } from './tasks.entity';
import { TaskStatus } from './tasks.enum';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async createTask(createtaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createtaskDto;
    const new_task = new TaskEntity();
    (new_task.title = title), (new_task.description = description);
    new_task.status = TaskStatus.OPEN;

    await new_task.save();

    return new_task;
  }
  async getTasks(filterDto: TaskFilterDto): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
