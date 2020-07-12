import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ObjectSchema } from '@hapi/joi';

import { StanPublisher } from './stan/stan-publisher';

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

export const PassportCookieSessionExtractor = (req: Express.Request) =>
  req?.session?.session ?? null;

export const publishAndRemoveStanEventRecord = async <
  EventDataT extends { id: any }
>(
  repository: Repository<EventDataT>,
  stanPublisher: StanPublisher<EventDataT>,
) => {
  for await (const record of await repository.find()) {
    try {
      await stanPublisher.publish(record);
      await repository.delete(record.id);
    } catch (error) {
      throw new Error(error);
    }
  }
};
