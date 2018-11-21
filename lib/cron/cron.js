const parser = require('cron-parser');
const Redis = require('ioredis');

var redis = new Redis({ host: 'redis-stream' });


tasks = [
    { id: 1, when: '*/2 * * * * *' }, 
    { id: 2, when: '*/5 * * * * *' }, 
    { id: 3, when: '5 5 22 * * *' }, 
    { id: 4, when: '5 5 22 14 * *' }, 
    { id: 4, when: '1 4 19 * * 7' }, 
]

tasks.forEach(function(e) {
    var interval = parser.parseExpression(e.when)
    console.log("Task: "+ e.id + " when: "+ interval.next())
    console.log(interval.prev())
    console.log("================")
})
