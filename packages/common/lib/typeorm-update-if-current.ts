import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class UpdateIfCurrentSubscriber implements EntitySubscriberInterface {
  beforeUpdate({
    metadata: { name, versionColumn },
    entity,
    databaseEntity,
  }: UpdateEvent<any>) {
    if (versionColumn && entity) {
      const entityVersion = Reflect.get(entity, versionColumn.propertyName),
        currentVersion = databaseEntity[versionColumn.propertyName],
        sub = entityVersion - currentVersion;

      if (sub < 0 || sub > 1)
        throw new UpdateIfCurrentVersionMismatchError(
          name,
          currentVersion + 1,
          entityVersion,
        );
    }
  }
}

class UpdateIfCurrentVersionMismatchError extends Error {
  name = 'UpdateIfCurrentVersionMismatchError';

  constructor(entity: string, expectedVersion: number, actualVersion: number) {
    super();
    Reflect.setPrototypeOf(this, UpdateIfCurrentVersionMismatchError.prototype);
    this.message = `The optimistic concurrency control on entity ${entity} failed, version ${expectedVersion} was expected, but is actually ${actualVersion}.`;
  }
}
