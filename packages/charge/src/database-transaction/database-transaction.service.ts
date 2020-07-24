import { Injectable } from '@nestjs/common';
import { getManager, EntityManager } from 'typeorm';

@Injectable()
export class DatabaseTransactionService {
  /**
   * Process a database transaction for specified actions
   * @param entityAndActions Tuple of [Entity, Action that needs to Applied]
   */
  async process<ResponseT extends any[] = any[]>(
    ...entityAndActions: [any, keyof EntityManager][]
  ) {
    try {
      let response: any[];
      await getManager().transaction(async transactionalEntityManager => {
        response = await Promise.all(
          entityAndActions.map(([repository, action]) =>
            (transactionalEntityManager[action] as any)(repository),
          ),
        );
      });

      return response as ResponseT;
    } catch (error) {
      throw new Error(error);
    }
  }
}
