const expect = require('chai').expect;
const Redis = require('ioredis');
const LoadConf = require('../lib/loadconf');
const config = require('../lib/config');

describe('LoadConf', function(){
  const redis = new Redis(config.redis); 
  const loader = new LoadConf(redis);

  after(async ()=> {
    // await redis.flushall();
    redis.quit();
  });
  describe('General', function() {
    it('should will be ok properties', function() {

      expect(loader).to.not.be.null;
    })
  });
  describe('Loading YAML', async function() {
    it('can be import yaml to redis', async function(){
      await loader.loadyml(config.conf_file)
      task = redis.hgetall('tid:2');
      task_ids = redis.smembers('tids:1');
      result = await Promise.all([task, task_ids]);
      expect(result[1][2]).to.equal('3');
      expect(result[0]).to.include({o: 'test'});
    })
  })
});
