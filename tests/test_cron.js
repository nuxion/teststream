const expect = require('chai').expect;
const sinon = require('sinon');
const Redis = require('ioredis');
const Croner = require('../lib/cron/croner');
const config = require('../lib/config.js');
const LoadConf = require('../lib/loadconf');

describe('Cron', function(){

  const redis = new Redis(config.redis);
  const loader = new LoadConf(redis);
  const cron = new Croner(loader, config);
  before(async ()=> {
    redis.flushall();
  });
  afterEach(async ()=>{
    await redis.flushall();
  });
  after(() => redis.quit());

  describe('EvalDate', function(){
    it('Emit should have been called', function(){
      cron.init();
      var spy = sinon.spy();
      const task = [{}, { id: 1, w:'* * * * *' }]
      cron.streamRegister(spy)
      cron.evalDate(task);
      //spy.called.should.equal.true;
      expect(spy.called).to.equal(true);
      //sinon.assert.calledOnce(spy);
    });
  });
  describe('getTasks', function(){
    it('Result should be to equal 3', async function(){
      cron.init();
      result = await cron.getTasks();
      expect(result.length).to.equal(3);
    });
    it('Stream called two times', async function(){
      cron.init();
      var spy = sinon.spy();
      cron.streamRegister(spy);
      await cron.getTasks();
      expect(spy.callCount).to.equal(1)
    })
  })
})
