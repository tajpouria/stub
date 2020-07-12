import { Injectable } from '@nestjs/common';
import { getManager, EntityManager } from 'typeorm';

@Injectable()
export class DatabaseTransactionService {
  async process<ResponseT extends any[] = any[]>(
    repoAndActions: [any, keyof EntityManager][],
  ) {
    try {
      let response: any[];
      await getManager().transaction(async transactionalEntityManager => {
        response = await Promise.all(
          repoAndActions.map(([repository, action]) =>
            (transactionalEntityManager[action] as any)(repository),
          ),
        );
      });

      return response as ResponseT;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
