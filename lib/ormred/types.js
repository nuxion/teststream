/**
 * Types that set specific redis operations.
 * Also retains the names of the fields and keys.
 */

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
  /**
  * Insert a hash.
  *
  * @param {string} id without prefix
  * @param {Array} values key, value, key, value...
  */
  constructor() {
    super();
  }
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
   * Get all the hash using index param
   */
  async selectall() {
    const indexes = await this.redis.smembers(this.structure.index);
    const self = this;
    self.all = [];
    const operations = indexes.map((item) => {
      return ['hgetall', self.structure.prefix.concat(item),
        function (err, results) {
          const newres = results;
          newres.id = self.structure.prefix.concat(item);
          self.all.push(results);
          return results;
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

module.exports.hash = Hash;
// var Set = Object.create(RedisType);

class Set extends RedisType {
  async insert(value) {
    return this.redis.set(this.structure.key, value);
  }
}
