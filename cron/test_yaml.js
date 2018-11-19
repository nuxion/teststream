const yaml = require('js-yaml');
const fs   = require('fs');
const Redis = require('ioredis');

var redisc = new Redis({ host: 'redis-stream' });
const yamlfile = './w1r1.yml';

var loadConfig = async (file, configHandler, taskHandler) => {

    var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

    config = configHandler(doc);

    tasks = doc.tasks.map(async (item) => { await taskHandler(item.task) })
    await Promise.all([config, tasks]);

}

var addConfig = (redis) => async (config) => {

    try{
       await redis.multi()
            .hmset('stream', 'h', config.stream_server.host, 'p', config.stream_server.port)
            .set('ver', config.version)
            .set('shard', config.shard)
            .exec();
    } catch(e){
        console.log(e);
    }
}

var addTask = (redis) => async (task) => {
    console.log(task.id + "w" + task.when + "o" + task.owner);
    console.log(task)
    try {
       await redis.multi()
                .hmset('tid:'+task.id, 'w', task.when, 'o', task.owner)
                .rpush('tids:1',task.id)
                .exec();    
    } catch(e){
        console.log(e);
    }
}

var addTaskRedis = addTask(redisc);
var addConfigRedis = addConfig(redisc);

console.log(typeof(addTaskRedis))
loadConfig(yamlfile, addConfigRedis, addTaskRedis).then((result) => {
    console.log("Finish...");
    redisc.disconnect()
    redisc.quit()
});

