const expect = require('chai').expect;
const Redis = require('ioredis');
const ORMRed = require('../lib/ormred').ORMRed;

describe('ORMRed', function(){


    const redis = new Redis({ host: 'redis-stream' }); 
    const task = { index: 'tids:1', 
        prefix: 'tid:', 
        type: 'hash', 
         fields: { when: 'w', owner: 'o' }};
    before(async ()=> {
      redis.flushall();
    });
    afterEach(async ()=>{
        await redis.flushall();
    });
    after(() => redis.quit());
        
    describe('General', function(){
        it('should will be ok properties', function(){
            tasks = new ORMRed(redis, task );
            expect(tasks).to.not.be.null;
        })
    });
    describe('Testing Hash Type', async function(){
        
        tasks = new ORMRed(redis, task);

        it('can add a task', async function(){
            await tasks.exec.insert(99, ['test', 'w']);
            result = await redis.hgetall('tid:99')
            expect(result['test']).to.be.a('string');
            expect(result['test']).to.equal('w');
        })
        it('can select a task', async function(){
            await tasks.exec.select(99);
            expect(result['test']).to.be.a('string');
            expect(result['test']).to.equal('w');
        })
        it('can delete a task', async function(){
            await tasks.exec.insert(99, ['test', 'w']);
            await tasks.exec.delete(99);
            resultHash = await redis.hgetall('tid:99')
            resultSet = await redis.smembers('tids:1')
            expect(resultHash).to.not.include({test: 'w'});
            expect(resultSet.length).to.be.equal(0);
            
        })

    })
    /*describe('Testing Set Type', async function(){

        setData = {key: 'testset',
                    type: 'set'}
        });
        setorm = new ORMRed(redis, setData)
    it('should be an object', async function (){
        expect(setorm).to.be.an('object');
    })
    it ('can insert a set', async function(){
        await setorm.exec.insert('test');
        result = await redis.get('testset');
        expect(result).to.equal('test');
    })*/
})
