import { readLines } from "https://deno.land/std@0.79.0/io/bufio.ts";
import { connect }   from "https://deno.land/x/amqp/mod.ts";

const messageComplete = async (lines: string) => {
  const connection = await connect();
  const channel    = await connection.openChannel();
  const queueName  = "cdc";

  await channel.declareQueue({ queue: queueName, durable: true, autoDelete: false });  
  await channel.publish(
    { routingKey: queueName, exchange: "cdc_exchange" }, 
    { contentType: "text/plain"},
    new TextEncoder().encode(lines) 
  );
  await connection.close();    
};   

const readCdcMessages = async () => {
  const pgRecvProcess = Deno.run(
      { cmd: [ 
          "pg_recvlogical", 
          "-d", 
          "admin", 
          "--slot", 
          "cdc_slot", 
          "-P", 
          "wal2json", 
          "-U", 
          "postgres", 
          "--start", 
          "-o", 
          "pretty-print=1", 
          "-f", "-" ], 
       stdout: "piped", 
       stderr: "piped", }); 

  let lines = '';

  /* json format expected */
  for await (const line of readLines(pgRecvProcess.stdout)) {
    if (line.substring(0, 1) === '}' && line.length === 2) {
       messageComplete(lines + line); 
       lines = '';
    } else {
       lines += line + '\n'; 
    }
  }  
};

readCdcMessages();
