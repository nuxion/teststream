
var Redis = require('ioredis');

var redis = new Redis({
  host: "redis-stream"
});

async function main() {
  // read events from the beginning of stream 'events'
  let res = await redis.sendCommand(
    new Redis.Command("XREAD", ["STREAMS", "queue", 0]));
  
  let events = res[0][1];
  for (var i=0; i<events.length; i++) {
    let thisEvent = events[i]
    console.log("## id is ", thisEvent[0].toString());
    for (var eachKey in thisEvent[1]) {
      console.log(thisEvent[1][eachKey].toString());
    }
  }
}

setInterval(main, 1500);
