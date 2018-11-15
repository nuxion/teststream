
var Redis = require('ioredis');

var redis = new Redis({
  host: "redis-stream"
});

async function main() {
  // write an event to stream 'events', setting 'key1' to 'value1'
    //
  await redis.sendCommand(
    new Redis.Command("XADD", ["queue", "*", "message", "NodeJS"]));

  console.log("sended");
  
}

main()
