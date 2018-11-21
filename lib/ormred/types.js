/**
 * Types that set specific redis operations. 
 * Also retains the names of the fields and keys. 
 */

module.exports.hash =  {
        insert: async function(id, values){
            //properties = Object.getOwnPropertyNames(values.fields);
            //consol
            if (this.structure.index){
                await this.redis.multi()
                    .hmset(this.structure.prefix.concat(id), values)
                    .rpush(this.structure.index, id).exec();
            } else {
                await this.redis.hmset(this.structure.prefix.concat(id), values);
            }
        },
        select: async function(id){
            //result = await this
            result = await this.redis.hgetall(this.structure.prefix.concat(id));
            return result;
        },
        selectall: async function(){
            const indexes = await this.redis.lrange(this.structure.index, 0, -1);
            var self = this;
            self.all = [];
            
            operations = indexes.map((item) => { 
                return ['hgetall', self.structure.prefix.concat(item), function(err, results){
                    results.id = self.structure.prefix.concat(item);
                    self.all.push(results);
                    return results
                }]})
            //indexes.forEach((id) => { pipe.hgetall(self.structure.prefix.concat(id))})
            //indexes.forEach((id) => { pipe.hgetall(self.structure.prefix.concat(id), async (e) => await console.log(e))})
            //return await this.redis.pipeline(operations).exec();
            //var all = indexes.map(async function (item) { await self.select(self.structure.prefix.concat(item)) })
            return await this.redis.pipeline(operations).exec()
        },
        delete: async function(id){
            fields = await this.redis.hkeys(this.structure.prefix.concat(id));
            result = await this.redis.hdel(this.structure.prefix.concat(id), fields);
            return result
        }

    }
module.exports.set = {
        insert: async function(value){
            return await this.redis.set(this.structure.key, value);
        }
    }

