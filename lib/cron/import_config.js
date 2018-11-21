const yaml = require('js-yaml');
const fs   = require('fs');
const Redis = require('ioredis');

var redis = new Redis({ host: 'redis-stream' });
const file = './w1r1.yml';

async function loadyaml(file){

    try {
        var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        console.log(doc);

        for (const x of doc.tasks){
            result = await redis.multi()
                .hmset('tid:'+ x.task.id, 'w', x.task.when, 'o', x.task.owner)
                .rpush('tids', x.task.id)
            .exec();
            console.log(x);
            console.log(result);
        };

    } catch (e){
        console.log(e);
    }
}

async function saveyaml(file){

    result = await redis.hmgetall()

}

run = loadyaml(file);
run.then(()=> {
    console.log("Finish import from: "+file);
    redis.disconnect();
    redis.quit();
})
