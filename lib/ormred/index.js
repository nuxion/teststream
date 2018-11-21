const Redis = require('ioredis');
const types = require('./types');

/**
 * ORMRed class, wrapper of types. 
 * @param {redis} redis object with the connection.
 * @param {structure} object with the data type. You must see types.js.
 */
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

/**
 * Method for change the func exec.
 * @param {name} string with the name of the type.
 * @param {func} function 
 */
ORMRed.prototype.setExecMethod = function (name, func){
    this.exec[name] = func;
}

module.exports.ORMRed = ORMRed;
