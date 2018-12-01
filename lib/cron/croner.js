const parser = require('cron-parser');
const EventEmitter = require('events');
const moment = require('moment-timezone');

/**
 * @class
 * @extends EventEmmiter
 */
class Croner extends EventEmitter {

  constructor(loader, config) {
    super();
    this.loader = loader;
    this.config = config;

  }

  /**
   * init
   * Factory of the class.
   */
  async init() {
    await this.loader.loadyml(this.config.conf_file);
    this.taskEvent();
  }
  
  /**
   * getTasks
   * get tasks from loader
   * and evaluate if the tasks have to be executed.
   */
  async getTasks() {
    const result = await this.loader.tasks.exec.selectall();
    const self = this;
    result.forEach((task) => { self.evalDate(task) });
    return result;
  }

  static transform(task) {
    console.log(`TASK: ${task}`);
    const t = task[1];
    return t;
  }

  /**
   * evalDate
   * receives a task, then parse the 'when' property to get
   * the date and evaluate if need to run the task. 
   * If do, emit a stream event with the task object.
   *
   * @param {Object} t
   */
  evalDate(t){
    const task = t[1];
    const taskWhen = parser.parseExpression(task.w).next().toString();
    const dateObj = new Date(taskWhen); // warning iso date format moment
    const toEvaluate = moment(dateObj);
    console.log(`\ntask: ${task.w} To evaluate: ${toEvaluate} \n`);
    if (moment().diff(toEvaluate, 'minutes') === 0){
      this.emit('stream', task);
    }
  }

  /**
   * deprecated
   */
  taskEvent(){
    this.on('tasks', this.evalDate);
  }

  /**
   * streamRegister 
   * When cron found task to run, it will be emit a event
   * to channel 'stream'.
   * @param {callback} cb
   **/
  streamRegister(cb) {
    this.on('stream', cb);
  }

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

module.exports = Croner;
