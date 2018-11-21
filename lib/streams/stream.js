
var Redis = require('ioredis');

var redis = new Redis({
  host: "redis-stream"
});

async function main() {
  // write an event to stream 'events', setting 'key1' to 'value1'
  await redis.sendCommand(
    new Redis.Command("XADD", ["queue", "*", "message", "NodeJS"]));
  
  // read events from the beginning of stream 'events'
  let res = await redis.sendCommand(
    new Redis.Command("XREAD", ["STREAMS", "queue", 0]));
  
  // parse the results (which are returned in quite a nested format)
  let events = res[0][1];
  for (var i=0; i<events.length; i++) {
    let thisEvent = events[i]
    console.log("## id is ", thisEvent[0].toString());
    for (var eachKey in thisEvent[1]) {
      console.log(thisEvent[1][eachKey].toString());
    }
  }
  redis.disconnect()
}

main()
