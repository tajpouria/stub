import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ObjectSchema } from '@hapi/joi';

import { StanPublisher } from './stan/stan-publisher';

/**
 * Nest-Joi validation pipe
 */
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

/**
 * Extract session from req.session.session
 * @param req
 */
export const PassportCookieSessionExtractor = (req: Express.Request) =>
  req?.session?.session ?? null;

/**
 * Publish stan events that no published and delete published ones
 * @param repository
 * @param stanPublisher
 */
export const publishUnpublishedStanEvents = async <
  StanEventDataT extends { id: any; published?: boolean }
>(
  repository: Repository<StanEventDataT>,
  stanPublisher: StanPublisher<StanEventDataT>,
) => {
  for await (const stanEvent of await repository.find()) {
    try {
      if (!stanEvent.published) await stanPublisher.publish(stanEvent);
      await repository.delete(stanEvent.id);
    } catch (error) {
      throw new Error(error);
    }
  }
};
