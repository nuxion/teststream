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

/*for (let i = 0; i < tasks.length; i++){
    console.log(tasks[i])
    //return true
}*/

//tasks.map(function(x) { console.log(x) })
//
// see: https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795
// https://hackernoon.com/async-await-essentials-for-production-loops-control-flows-limits-23eb40f171bd
async function processArray(array){
    for (const item of array){
        result = await redis.multi()
            .hmset('task:'+item.id, 'when', item.when)
            .rpush('tids:1',item.id)
            .exec();
        console.log(result);

    }

}

async function test(tasks){
    const j = 10;
    for (let i = 0; i < tasks.length; i++){
        result = await redis.multi()
            .hmset('task:'+tasks[i].id, 'when', tasks[i].when)
            .rpush('tids:1',tasks[i].id)
            .exec();
        console.log(result);

    }
}
ejec = test(tasks);
ejec.then((result) => {
    
    console.log("FINISHHHHHH!");
    redis.disconnect()
    redis.quit()
}) 
/*function (err, results){
            if (err){
                console.log(err);
                console.log(value);
            }else{
                console.log(results);
                console.log(value);
            }

        }*/ 
