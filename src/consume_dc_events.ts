import { connect } from "https://deno.land/x/amqp/mod.ts";

const connection = await connect();
const channel    = await connection.openChannel();
const queueName  = "cdc";

const { queue } = await channel.declareQueue({ queue: queueName, durable: true });
await channel.declareExchange({ exchange: "cdc_exchange", type: "direct", durable: true, autoDelete: false });
await channel.bindQueue({ exchange: "cdc_exchange", routingKey: queue });

await channel.consume(
  { queue: queueName },
  async (args, props, data) => {
    console.log(new TextDecoder().decode(data));
    await channel.ack({ deliveryTag: args.deliveryTag });
  },
);