var Redis = require('ioredis');
var redis = new Redis({ host: 'redis-stream' });
var pub = new Redis({ host: 'redis-stream' });
redis.subscribe('news', 'music', function (err, count) {
  // Now we are subscribed to both the 'news' and 'music' channels.
  // `count` represents the number of channels we are currently subscribed to.

  pub.publish('news', 'Hello world!');
  pub.publish('music', 'Hello again!');
});

