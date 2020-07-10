import {
  connect as nodeNatsConnect,
  Stan as nodeNatsStan,
} from 'node-nats-streaming';

export class StanConnection {
  private sc?: nodeNatsStan;

  async connect({
    clusterID,
    clientID,
    url,
  }: {
    clusterID: string;
    clientID: string;
    url: string;
  }) {
    this.sc = nodeNatsConnect(clusterID, clientID, { url });

    return new Promise((res, rej) => {
      this.sc!.on('connect', (err) => {
        if (err) return rej(err);
        res();
      });
    });
  }

  get instance() {
    const { sc } = this;

    if (!sc)
      throw new Error(
        'Nats connection not established properly; Make sure to awaiting for this.connect first',
      );

    return sc;
  }
}
