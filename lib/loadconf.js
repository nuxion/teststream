const yaml = require('js-yaml');
const fs = require('fs');
const ORMRedis = require('./ormred').ORMRed;

/**
 * Config function
 * Load yaml file  with tasks and stream server configuration.
 *
 * @constructor
 * @param {object} redis
 */
function LoadConf(redis) {
  this.redis = redis;
  this.tasks = new ORMRedis(redis,
    {
      index: 'tids:1',
      prefix: 'tid:',
      type: 'hash',
      fields: { when: 'w', owner: 'o', stream: 's' },
    });
  this.stream = new ORMRedis(redis, { prefix: 'stream', type: 'hash', fields: { host: 'h', port: 'p' } });
  this.version = new ORMRedis(redis, { key: 'ver', type: 'set' });
  this.shard = new ORMRedis(redis, { key: 'shard', type: 'set' });
}

/**
 * Load yaml file.
 *
 * @param {file} string path with the filename
 * */
LoadConf.prototype.loadyml = async function (file) {
  const cfg = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

  const version = this.version.exec.insert(cfg.version);
  const shard = this.shard.exec.insert(cfg.shard);
  const stream = this.stream.exec.insert('', [cfg.stream_server.host, cfg.stream_server.port]);
  const tasks = cfg.tasks.map(async (item) => {
    await this.tasks.exec.insert(
      item.task.id, ['o', item.task.owner, 'w', item.task.when, 's', item.task.stream]
    );
  });
  await Promise.all([shard, stream, version, tasks]);
};

module.exports = LoadConf;
