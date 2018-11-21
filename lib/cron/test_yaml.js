const yaml = require('js-yaml');
const fs   = require('fs');
const Redis = require('ioredis');

var redisc = new Redis({ host: 'redis-stream' });
const yamlfile = './w1r1.yml';

function Config(redis, file){

    this.redis = redis;
    this.file = file;
    // redis keys
    this.rkeys = {
        tid: { key: 'tid:', type: 'hset', fields: {when: 'w', owner: 'o'}},
        tasks:{ key: 'tids:', type: 'set' },
        hstream: { key: 'stream', type: 'hset', fields: { host: 'h', port: 'p' }},
        version: { key: 'ver', type: 'set'},
        shard: { key: 'shard', type: 'set'}
    }
    this.task = { index: 'tids:1', key: 'tid:', type: 'hset', fields: { when: 'w', owner: 'o' }};
    this.stream = {key: 'stream', type: 'hset', fields: { host: 'h', port: 'p'}};
    this.version = { key: 'ver', type: 'set' };
    this.shard = { key: 'shard', type: 'set' };

}

Config.prototype.loadyml = async function() {

    this.cfg = yaml.safeLoad(fs.readFileSync(this.file, 'utf8'));

    general = this.addGeneral();

    tasks = this.cfg.tasks.map(async (item) => { await this.addTask(item.task) })
    await Promise.all([general, tasks]);

}

Config.prototype.addGeneral = async function () {

    try{
        stream = this.rkeys.hstream;
        shard = this.rkeys.shard;
        version = this.rkeys.version;
       await this.redis.multi()
            .hmset(stream.key, 
                stream.fields.host, this.cfg.stream_server.host,
                stream.fields.port, this.cfg.stream_server.port)
            .set(version.key, this.cfg.version)
            .set(shard.key, this.cfg.shard)
            .exec();
    } catch(e){
        console.log(e);
    }
}

Config.prototype.addTask = async function (task) {
    console.log(task.id + "w" + task.when + "o" + task.owner);
    console.log(task)
    try {
       await this.redis.multi()
                //.hmset('test', ['key', 'data', 'key2', 'data2'])
                .hmset('tid:'+task.id, 'w', task.when, 'o', task.owner)
                .rpush('tids:1',task.id)
                .exec();    
    } catch(e){
        console.log(e);
    }
}
Config.prototype.saveyml = async function(task) {
    this.redis.multi().hmgetall('tid:' + task.id)
}



var appconf = new Config(redisc, yamlfile);
appconf.loadyml().then((result) => {
    console.log("Finish...");
})

//export { Config };
