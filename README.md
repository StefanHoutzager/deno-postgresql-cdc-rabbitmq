# deno-postgresql-cdc-rabbitmq

## What it is and why I made it

This is some code to get "Change Data Capture" (cdc) and realtime messaging working. RabbitMQ is used as
message broker, the database is postgresql. Most databases offer cdc, postgresql comes with an executable
capturing changes that I use in this code. The code is written in typescript and runs serverside in deno 
(successor of node.js). Captured changes are formatted in JSON. See cdc.png in this repo to get an idea 
what can be done: 
  An update to a postgresql database was just performed in pgadmin4 (this update could have come from 
anywhere), the update was consumed by a deno sub process: the executable provided by postgresql, the output
was published to rabbitmq by the deno process. The cdc message is in the end pushed to the two browsers 
that you see, via a websocket connection, and a second, listening, deno process. You can imagine that 
there could be numerous different types of listeners (applications, databases - realtime replication -, 
browsers) and how the incoming message could trigger other events in the browsers / applications. Contact 
me if you are interested to see what the possibilities are for your company.

### Instructions to get the code working:

0.  Put public/cdc.html and public/css/cdc.css on your webserver.
1.  Install deno https://deno.land/ 
2.  Install rabbitMQ https://www.rabbitmq.com/
3.  Enable the STOMP plugin https://www.rabbitmq.com/stomp.html
4.  Start RabbitMQ management https://www.rabbitmq.com/management.html, go to tabfolder exchanges and create
    an exchange named cdc_exchange (direct and durable).
5.  Build and install wal2json, configure postgresql https://github.com/eulerto/wal2json
6.  Start your webserver (see 0)
7.  Execute create_slot_and_start.bat (in repo)
8.  Execute consume.bat if you want to see a listening deno process working
9.  Navigate to <your webserver>/cdc.html
10. Perform a datachange in postgresql
11. Shutdown the deno proces started by create_slot_and_start.bat in your cmd and execute drop_slot.bat

### License 

GNU GPLv3. If you enable this package for other databasetypes please create a fork in a public repo 