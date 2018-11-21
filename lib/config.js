const yaml = require('js-yaml');
const fs   = require('fs');
const Redis = require('ioredis');
const ORMRedis = require('./ormred').ORMRed;

var redisc = new Redis({ host: 'redis-stream' });
const yamlfile = './cron/w1r1.yml';

/**
 * Config function
 * Load yaml file  with tasks and stream server configuration.
 *
 * @constructor
 * @param {redis} object
 * @param {file} string path
 */
function Config(redis, file){

    this.redis = redis;
    // redis keys
    this.rkeys = {
        tid: { key: 'tid:', type: 'hset', fields: {when: 'w', owner: 'o'}},
        tasks:{ key: 'tids:', type: 'set' },
        hstream: { key: 'stream', type: 'hset', fields: { host: 'h', port: 'p' }},
        version: { key: 'ver', type: 'set'},
        shard: { key: 'shard', type: 'set'}
    }
    this.tasks = new ORMRedis(redis, 
        { index: 'tids:1', 
            prefix: 'tid:', 
            type: 'hash', 
            fields: { when: 'w', owner: 'o', stream: 's' }});
    this.tasks.setTypeObject();
    this.stream = new ORMRedis(redis, {prefix: 'stream', type: 'hash', fields: { host: 'h', port: 'p'}});
    this.stream.setTypeObject();
    this.version = new ORMRedis(redis, { key: 'ver', type: 'set' });
    this.shard = new ORMRedis(redis, { key: 'shard', type: 'set' });

    this.stream.setName("stream");
    this.tasks.setName("tasks");
    this.stream.setName("stream");

}

/**
 * Load yaml file.
 *
 * @param {file} string path with the filename
 * */
Config.prototype.loadyml = async function(file) {

    cfg = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

    /*version = this.stream.exec.insert(cfg.version);
    shard = this.shard.exec.insert(cfg.shard);
    stream = this.stream.exec.insert('', [cfg.stream_server.host, cfg.stream_server.port]);*/
    
    self = this;
    /*tasks = cfg.tasks.map(async (item) => { await this.tasks.exec.insert(item.task.id, 
            ['o', item.task.owner, 'w', item.task.when, 's', item.task.stream]) })*/
    tasks = cfg.tasks.map(async (item) => { await this.tasks.exec.insert(
        item.task.id, ['o', item.task.owner, 'w', item.task.when, 's', item.task.stream]
    )})
    console.log(this.tasks.exec.structure)
    /*await Promise.all([shard, stream, verison, tasks]);*/
    await Promise.all([tasks]);

}


var appconf = new Config(redisc);
appconf.loadyml(yamlfile).then((result) => {
    console.log("Finish...");
})

//export { Config };
