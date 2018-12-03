const Redis = require('ioredis');
const RedisType = require('./types').RedisType;

/**
 * Class RStream
 * Manage stream datatype.
 */
class RStream extends RedisType {
  constructor(){
    super();
  }

  /**
   * insert
   * @param {string} stream name of the channel to send the msg.
   * @param {Array} values array with key,value comma separated.
   */
  async insert(stream, values) {
    try {
      await this.redis.sendCommand(
        new Redis.Command('XADD', [stream, '*', values]),
      );
    } catch (err) {
      return -1;
    }
    return 1;
  }
}

module.exports = RStream;
