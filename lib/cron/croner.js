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
    // const result = await this.loader.tasks.exec.selectall();
    const result = await this.loader.getTasks();
    const self = this;
    result.forEach((task) => { self.evalDate(task); });
    return result;
  }

  static transform(task) {
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
  evalDate(t) {
    const task = t[1];
    const taskWhen = parser.parseExpression(task.w).next().toString();
    const dateObj = new Date(taskWhen); // warning iso date format moment
    const toEvaluate = moment(dateObj);
    if (moment().diff(toEvaluate, 'minutes') === 0) {
      this.emit('stream', task);
    }
  }

  /**
   * deprecated
   */
  taskEvent() {
    this.on('tasks', this.evalDate);
  }

  /**
  * streamRegister
  * When cron found task to run, it will be emit a event
  * to channel 'stream'.
  * @param {callback} cb
  */
  streamRegister(cb) {
    this.on('stream', cb);
  }

  /**
   * run
   * loop that iterate and check tasks on redis.
   * @param {int} sleepTime in milliseconds
   */
  async run(sleepTime) {
    await this.init();
    while (true) {
      console.debug(`Now: ${moment().format()}`);
      const tasks$ = this.getTasks();
      const sleep$ = this.sleep(sleepTime);
      await Promise.all([tasks$, sleep$]);
      /*await this.getTasks();
      await this.sleep(sleepTime);*/
      console.debug('TICK');
    }
  }
}

Croner.prototype.sleep = (val) => {
  return new Promise(resolve => setTimeout(resolve, val));
}

module.exports = Croner;
