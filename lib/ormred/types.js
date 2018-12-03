/**
 * Types that set specific redis operations.
 * Also retains the names of the fields and keys.
 */

const Redis = require('ioredis');

/**
 * Class RedisType
 * It only has the function init()
 * */
class RedisType {
  /**
  * Establish as local the redis connection and
  * the structure for this type.
  *
  * @param redis Object
  * @param structure Object
  */
  init(redis, structure) {
    this.redis = redis;
    this.structure = structure;
  }
}

// const Hash = Object.create(RedisType);
/**
 * Class Hash
 * Inheritance from RedisType
 * The type structure is:
 *      - index (optional) if this exists, create a list with ids.
 *      - prefix: 'pre:'
 *      - type: 'hash'
 *      - fields: {key: 'redis_key'} --> its only for reference.
 *
*/
class Hash extends RedisType {
  constructor() {
    super();
  }

  /**
  * Insert a hash.
  *
  * @param {string} id without prefix
  * @param {Array} values key, value, key, value...
  */
  async insert(id, values) {
    // properties = Object.getOwnPropertyNames(values.fields);
    if (this.structure.index) {
      await this.redis.multi()
        .hmset(this.structure.prefix.concat(id), values)
        .sadd(this.structure.index, id).exec();
    } else {
      await this.redis.hmset(this.structure.prefix.concat(id), values);
    }
  }

  /**
  * Select only one hash.
  *
  * @param(string) id
  */
  async select(id) {
    const result = await this.redis.hgetall(this.structure.prefix.concat(id));
    return result;
  }

  /**
   * Get all hashes using index param
   */
  async selectall() {
    const indexes = await this.redis.smembers(this.structure.index);
    const self = this;
    self.all = [];
    const operations = indexes.map((item) => {
      return ['hgetall', self.structure.prefix.concat(item),
        function (err, result) {
          const newres = result;
          newres.id = self.structure.prefix.concat(item);
          self.all.push(result);
          return result;
        },
      ];
    });
    return this.redis.pipeline(operations).exec();
  }

  /**
   * Delete specific item.
   * @param {string} id
   */
  async delete(id) {
    if (this.structure.index) {
      this.redis.srem(this.structure.index, id);
    }
    const fields = await this.redis.hkeys(this.structure.prefix.concat(id));
    const result = await this.redis.hdel(this.structure.prefix.concat(id), fields);
    return result;
  }
}

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
    console.log("INSEEERT STREAM")
//    try {
      await this.redis.sendCommand(
        new Redis.Command('XADD', [stream, '*', values]),
      );
//    } catch (err) {
      return -1;
  //  }
    return 1;
  }
}

class Set extends RedisType {
  constructor() {
    super();
  }

  async insert(value) {
    return this.redis.set(this.structure.key, value);
  }
}

module.exports.stream = RStream;
module.exports.hash = Hash;
module.exports.set = Set;
