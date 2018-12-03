
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

function xreadTransf() {
  Redis.Command.setReplyTransformer('xread', function(result){
    let events = result[0][1];
    var listStreams = []
    for (var i=0; i<events.length; i++){
      console.log(events[i]);
      object = {};
      object.id = events[i][0].toString('utf8');
      object.values = {};
      var thisEvent = events[i]
      console.log(thisEvent.toString('utf8'))
      for (var j=0; j<thisEvent[1].length; j+=2){ 
        var key = thisEvent[1][j].toString('utf8');
        object.values[key] = thisEvent[1][j+1].toString('utf8');
      }
      listStreams.push(object);
    }
    return listStreams;
  });
}
async function main2() {
  xread = new Redis.Command('xread', ['STREAMS', 'queue', 2]);
  xreadTransf();
  const res = await redis.sendCommand(xread);
  console.log(res);

}
setInterval(main2, 1500);
