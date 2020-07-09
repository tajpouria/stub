import { Message, Stan, Subscription } from "node-nats-streaming";
import Ajv, { ErrorObject } from "ajv";
import { randomBytes } from "crypto";

import { StanEventSchema } from "./types";

export abstract class StanListener<DataT extends object> {
  abstract eventSchema: StanEventSchema;

  protected ackWait: number = 5000;

  private sub: Subscription | undefined;

  private subOptions = (qGroup: string = randomBytes(4).toString("hex")) => {
    return this.stan
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(5000)
      .setDurableName(qGroup);
  };

  constructor(private stan: Stan) {}

  listen(qGroup?: string) {
    const { stan, eventSchema, subOptions } = this;
    const { subject } = eventSchema;

    if (!subject) throw new Error("EventSchema.subject is not provided!");

    if (qGroup) this.sub = stan.subscribe(subject, qGroup, subOptions(qGroup));
    else this.sub = stan.subscribe(subject, subOptions());

    return this;
  }

  onMessage(
    cb: (
      validationErrors: ErrorObject[] | null,
      data: DataT,
      msg: Message,
    ) => void,
  ) {
    const { sub, eventSchema } = this;

    if (sub)
      sub.on("message", (msg: Message) => {
        const data = this.parseMessage(msg);

        const ajv = new Ajv();
        const validate = ajv.compile(eventSchema);
        validate(data);

        cb(validate.errors ?? null, data, msg);
      });
    else
      throw new Error(
        "Subscription is not initialized properly; Make sure that calling this.listen(qGroup) first.",
      );
  }

  private parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
