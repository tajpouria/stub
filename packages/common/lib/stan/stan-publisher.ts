import { Stan } from "node-nats-streaming";
import { StanEventSchema } from "./types";

export abstract class StanPublisher<DataT extends object> {
  abstract eventSchema: StanEventSchema;

  constructor(private stan: Stan) {}

  async publish(data: DataT): Promise<void> {
    const { stan, eventSchema } = this;

    return new Promise((res, rej) => {
      stan.publish(eventSchema.subject, JSON.stringify(data), (err) => {
        if (err) return rej(err);

        res();
      });
    });
  }
}
