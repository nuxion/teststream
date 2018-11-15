const yaml = require('js-yaml');
const fs   = require('fs');
const Redis = require('ioredis');

var redis = new Redis({ host: 'redis-stream' });




try {
    var doc = yaml.safeLoad(fs.readFileSync('./w1r1.yml', 'utf8'));
    console.log(doc);
} catch (e){
    console.log(e);
}


