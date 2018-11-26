const parser = require('cron-parser');
const EventEmitter = require('events');
const moment = require('moment-timezone');

class Croner extends EventEmitter{

  constructor(loader, config){
    super();
    this.loader = loader;
    let self = this;
    this.printparser = (data) => {
      const interval = parser.parseExpression(data.w).next().toString();
      const fecha = moment(interval);
      const diff = moment().diff(fecha, 'minutes');
      //self.emit('stream', diff);
      if (diff === 0){
        self.emit('stream', data);
      }
    };

  }
  use(obj){
    this[obj.name] = obj;
  }
  async init(){
    await this.loader.loadyml(config.conf_file);
    this.taskEvent();
    this.toStream();
  }
  async getTasks() {

    const result = await this.loader.tasks.exec.selectall();
    let self = this;
    result.forEach((task) => { self.emit('tasks', self._transform(task))} );
    return result;
  }
  _transform(task) {
    let t = task[1];
    return t;
  }
  register(func){
    this.on('tasks', func);
  }
  evalDate(task){
    const taskWhen = parser.parseExpression(task.w).next().toString();
    console.log(taskWhen);
    const toEvaluate = moment(taskWhen);
    if (moment().diff(toEvaluate, 'minutes') === 0){
      this.emit('stream', task);
    }
  }
  taskEvent(){
    this.on('tasks', this.evalDate);
  }
  /**
   * toStream posible aca deba agregar el register 
   * para el metodo que vaya a enviar la informacion
   * al stream server.
   */
  toStream(){
    this.on('stream', (data)=> console.log(data));
  }
  toStream2(func){
    this.on('stream', func.cb);
  }

}

class Stream{
  constructor(){
    this.hello = "Hola";
  }
  cb(data){
    //console.log(data + 'Saludo: ' + this.hello);
    console.log(this.hello);
  }
}

const Redis = require('ioredis');
const LoadConf = require('../loadconf');
const config = require('../config');

const redis = new Redis(config.redis); 
const loader = new LoadConf(redis);

const sleep = () => {
  return new Promise (resolve => setTimeout(resolve,60000));
}

stream = new Stream();
cron = new Croner(loader, config);
cron.toStream2(stream);
const runner = async function () {
  await cron.init();
  while (true){
    //let result$ = await cron.getTasks();
    await cron.getTasks();
    await sleep();
    console.log("TICK");
  }
}


runner().then(
  (result) => {redis.quit();}
);
