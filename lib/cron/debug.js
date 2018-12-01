const Redis = require('ioredis');
const LoadConf = require('../loadconf');
const config = require('../config');
const moment = require('moment-timezone');
const Croner = require('./croner');

const redis = new Redis(config.redis);
const loader = new LoadConf(redis);

const QUARTERMIN = 15000;
const HALFMIN = 30000;
const AMIN  = 60000;
const sleep = () => {
  return new Promise(resolve => setTimeout(resolve, QUARTERMIN));
};

/**
 * @class
 * Only for mocking purposes
 */
class Stream{
  constructor() {
    this.hello = "From Stream -->";
    this.cb = this.cb.bind(this);
  }

  cb(data) {
    //console.log(this.hello + "Data: " + data);
    console.log(`${ this.hello } data: ${data.id}, ${data.w}`);
  }
}

const stream = new Stream();
const cron = new Croner(loader, config);
cron.streamRegister(stream.cb);
const runner = async function run() {
  await cron.init();
  while (true) {
    console.log(`Now: ${moment().format()}`);
    //let result$ = await cron.getTasks();
    await cron.getTasks();
    await sleep();
    console.log('TICK');
  }
};


runner().then(() => { redis.quit(); });
