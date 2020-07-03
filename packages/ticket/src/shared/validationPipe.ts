import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error)
      throw new BadRequestException(
        error.details.map(({ message }) => message),
      );

    return value;
  }
}
