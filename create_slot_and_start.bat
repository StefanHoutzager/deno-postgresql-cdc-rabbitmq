pg_recvlogical -d admin -U postgres --slot cdc_slot --create-slot -P wal2json
deno run --allow-run --allow-net ./src/main.ts