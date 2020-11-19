import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../tasks.enum';

export class TaskStatusValidator implements PipeTransform {
  readonly allowes_status = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log('value >> ', value);

    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }
  private isStatusValid(value: any): boolean {
    const idx = this.allowes_status.indexOf(value);
    return idx != -1;
  }
}
