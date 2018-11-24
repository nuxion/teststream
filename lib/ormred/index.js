const Redis = require('ioredis');
const types = require('./types');

/**
 * ORMRed class, wrapper of types. 
 * @param {redis} redis object with the connection.
 * @param {structure} object with the data type. You must see types.js.
 */
function ORMRed(redis, structure){

    this._type = structure.type;
    this.exec = Object.create(types[structure.type]);
    this.exec = new types[structure.type];
    this.exec.init(redis, structure);
    //this.exec = types[structure.type];
}

ORMRed.prototype.setName = function(name){
    // debug
    this.name = name;
    console.log(this.name);
    console.log(this._type);
}

/**
 * Not finished, its for manual setting the type with her own
 * operations.
 * It needs had a init function with redis and structure.
 * @param {newType} object
 */
ORMRed.prototype.setTypeObject = function (newType) {
    this.exec = Object.create(newType);
}

/**
 * Method for change the func exec.
 * @param {name} string with the name of the type.
 * @param {func} function 
 */
ORMRed.prototype.setExecMethod = function (name, func){
    this.exec[name] = func;
}

module.exports.ORMRed = ORMRed;
