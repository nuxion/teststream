const Redis = require('ioredis');
const types = require('./types');


function ORMRed(redis, structure){

    this._type = types[structure.type];
    this._fields = structure.fields;
    // this._redis = redis;
    //this._conf = structure;
    this.exec = types[structure.type];
    this.exec.redis = redis;
    this.exec.structure = structure
}

/*ORMRed.prototype.setTypeObject(name, func){
    this._type = name;
    this.exec = func;
    this.exec.redis = this._redis;
    this.exec.structure = this._conf;
}*/

ORMRed.prototype.setExecMethod = function (name, func){
    this.exec[name] = func;
}

module.exports.ORMRed = ORMRed;
/*tasks = new ORMRed(redisc, { index: 'tids:1', prefix: 'tid:', type: 'hash', fields: { when: 'w', owner: 'o' }});
/*tasks.exec.save(2, ['w', '* * * *', 'o', 'segundo']).then(
    (reuslt) => {
        console.log("Finish...");
    }
);*/
/*
//tasks.exec.select('1').then( (result)=> console.log(result));
tasks.exec.selectall().then( (result)=> console.log(tasks.exec.all));
*/


       



