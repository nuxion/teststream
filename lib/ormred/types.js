/**
 * Types that set specific redis operations. 
 * Also retains the names of the fields and keys. 
 */

/**
 * Class RedisType
 * It only has the function init()
 * */
var RedisType = {
     /**
     * Establish as local the redis connection and 
     * the structure for this type.
     *
     * @param redis Object
     * @param structure Object
     */
   init: function(redis, structure){
        this.redis = redis;
        this.structure = structure;
    }
}

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
var Hash = Object.create(RedisType);
/**
 * Insert a hash.
 *
 * @param {id} string without prefix
 * @param {values} Array key, value, key, value...
 */
Hash.insert = async function(id, values){
            //properties = Object.getOwnPropertyNames(values.fields);
            //consol
            if (this.structure.index){
                await this.redis.multi()
                    .hmset(this.structure.prefix.concat(id), values)
                    .sadd(this.structure.index, id).exec();
            } else {
                await this.redis.hmset(this.structure.prefix.concat(id), values);
            }
        }

Hash.select =  async function(id){
            //result = await this
            result = await this.redis.hgetall(this.structure.prefix.concat(id));
            return result;
}

Hash.selectall = async function(){
            const indexes = await this.redis.smembers(this.structure.index);
            var self = this;
            self.all = [];
            
            operations = indexes.map((item) => { 
                return ['hgetall', self.structure.prefix.concat(item), function(err, results){
                    results.id = self.structure.prefix.concat(item);
                    self.all.push(results);
                    return results
                }]})
            return await this.redis.pipeline(operations).exec()
        }
Hash.delete = async function(id){
            if (this.structure.index){
                this.redis.srem(this.structure.prefix.concat(id));
            }
            fields = await this.redis.hkeys(this.structure.prefix.concat(id));
            result = await this.redis.hdel(this.structure.prefix.concat(id), fields);
            return result
        }

module.exports.hash = Hash;
var Set = Object.create(RedisType);
Set.insert= async function(value){
            return await this.redis.set(this.structure.key, value);
        }

