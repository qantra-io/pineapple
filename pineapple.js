const lodash = require('lodash');
const debug  = require('debug')('qantra:pineapple');

const defaultErrorSchema = {
    marker: '$label',
    onError: {
      required: '$label is required',
      length: '$label has invalid length',
      regex: '$label has invalid format',
      type: '$label invalid type',
      oneOf: '$label invalid option',
      inclusive: '$label dependent on ',
      exclusive: '$label conflict with other',
      canParse: '$label invalid parsing',
      items: 'one of the $label items is invalid'
    }
}

class Pineapple {

  constructor(validationSchema=[], errorSchema = defaultErrorSchema){

    this.validationSchema  = validationSchema;
    this.errorSchema       = errorSchema;
    this.nonMethodVectors  = ['label','path','onError','propValue','model','required'];

  }

  //validation helpers
  isString(v) {
    return lodash.isString(v);
  }
  isNumber(v) {
    return lodash.isNumber(v);
  }
  isArray(v) {
    return lodash.isArray(v)
  }
  isObject(v){
    return lodash.isPlainObject(v);
  }
  isBoolean(v){
    return lodash.isBoolean(v);
  }
  isNull(v){
    return lodash.isNull(v);
  }
  isUndefined(v){
    return lodash.isUndefined(v);
  }
  isRegExp(v){
    return lodash.isRegExp(v);
  }
  isDate(v){
    return lodash.isDate(v);
  }
  isNaN(v){
    return lodash.isNaN(v);
  }

  //validation methods
  _type(vo){
    let typeName    = vo.type.toLowerCase();
    typeName        = typeName.charAt(0).toUpperCase() + typeName.substring(1);
    let methodName  = `is${typeName}`;
    let method      = this[methodName];
    if(method){
      return method(vo.propValue);
    } else { throw Error(`Unable to find method relevant with: ${typeName}`)}
  }
  _oneOf(vo){
    return vo.oneOf.includes(vo.propValue)
  }
  _length(vo){

    let vectorValue = vo.length;
    let propValue   = vo.propValue;
    //if data not array convert data to string
    if(!this.isArray(propValue)) {
      propValue = propValue.toString();
    }
    //if the length vector type = number
    if(this.isNumber(vectorValue)) return (vectorValue == propValue.length);

    let valid = true;

    if(vectorValue.min && valid){
      valid = (propValue.length >= vectorValue.min);
    }
    if(vectorValue.max && valid){
      valid = (propValue.length <= vectorValue.max);
    }
    return valid;

  }
  _regex(vo){
    return (new RegExp(vo.regex).test(vo.propValue))
  }

  /**
    items can be called only in a property of type Array
    items validation vector can be an array if the 'to be validated prop' is array of objects
    items validation vector cab be an object if the 'to be validated prop' is array of strings or numbers
  */
  _items(vo){
    vo = JSON.parse(JSON.stringify(vo));

    let result = true;
    let errorObject = null;

    if(vo.type == 'Array'){

      if(this.isArray(vo.items)){
        //call validate again
        for(let i=0; i<vo.propValue.length; i++){
          errorObject = this.validate(vo.propValue[i], vo.items);

          /** because validating array of object recursively calls validate
           * we need to reference back to the parent the index of errored item. so if the errorObject contains index
           * it means that the index needs to be added to the parent log and
           * the errorObject will be embedded in the errros property
           */
          if(errorObject && errorObject.length>0){
            result = {
              index: i.toString(),
              errors: errorObject
            }
            break;
          }
        }

      } else {

        let validationVectors = this.getValidationVectors(vo.items)

        for(let i=0; i<vo.propValue.length; i++){

          for(let x=0; x<validationVectors.length; x++){

            let valicationVectorName = validationVectors[x];

            let newVO = {
              propValue: vo.propValue[i],
              label: vo.label,
              vector: 'items',
              index: i.toString(),
              path: `${vo.path}`
            };

            newVO[valicationVectorName]=vo.items[valicationVectorName];

            errorObject = this.exec(valicationVectorName, newVO);

            if(errorObject){
              result = errorObject;
              break;
            }
          }

          if(errorObject)break;
        }

      }
    } else {
      throw Error(`Unable to validate items under path ${vo.path} because it is not an Array`);
    }

    return (result);
  }
  _canParse(vo){

    let v      = vo.propValue;
    let result = false;
    switch(vo.canParse){
        case 'date':
            result = (new Date(v) != "Invalid Date") && !this.isNaN(new Date(v));
            break;
        case 'int':
            result = (this.isNaN(parseInt(v)))?false:true;
            break;
        case 'float':
            result = ((this.isNaN(parseFloat(v)))?false:true);
    }
    return result;

  }

  /**
  finds value of a specifc prop from object
  using path
  */
  getDeepValue(obj,path){

    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
      var level = obj[path[i]];
      if(!level)return false;
      obj = level;
    };
    return obj;

  }

  /**
  extracts validation model from predefined
  validation scheme
  */
  getExactValidationModel(modelName){
    return this.validationSchema.filter(i=>i.model==modelName)[0]
  }

  /** merge incoming model with baseModel */
  mergeModels(baseModel, inModel){
    return lodash.merge(baseModel, inModel);
  }

  /** creates the returned error object */
  createErrorObj(validationVectorName, vo, result={}){
    let vv        = vo.vector || validationVectorName;
    let label     = vo.label || vo.path || '';
    let path      = vo.path;
    let log       = `_${validationVectorName}`+ ((vo.index)?` @index(${vo.index})`:'') + ((result.index)?` @index(${result.index})`:'');
    let message   = ( (vo.onError && vo.onError[vv] )   || this.errorSchema.onError[vv] || '').replace(this.errorSchema.marker, label);
    return {label, path, message, log, errors:result.errors||[]}
  }

  /** if the excution is succesful it will return null */
  exec(validationVectorName, vo){

    let errorObject                 = null;
    let validationMethodName        = `_${validationVectorName}`;

    let method                      = this[validationMethodName];

      if(method){

        /** result can be true or false or object */
        let result = method.bind(this)(vo);
        if(!result){
          errorObject = this.createErrorObj(validationVectorName, vo);
        } else if(this.isObject(result) && !result.index){
          /** this is an error object that returns from a property that is not an array of objects */
          errorObject = result;
        } else if(this.isObject(result) && result.index){
          /** this an error object that returns from validating array of objects - includes an index property referencing to the parent the index of the errored ite, */
          errorObject = this.createErrorObj(validationVectorName, vo, result);
        }

    } else {
      throw Error(`Unable to find validation method: ${validationMethodName}`)
    }

    return errorObject;
  }

  /**
  exports valid valdation vector names from the validation model
  **/
  getValidationVectors(vo){
    return Object.keys(vo).filter(i=>!this.nonMethodVectors.includes(i));
  }

  /**
  passes every propvalue and validation vector to exec
  */
  evaluate(obj, ivm, isItems){

    let inValidationModel    = ivm;
    let baseValidationModel  = this.getExactValidationModel(inValidationModel.model);

    if(isItems)baseValidationModel = baseValidationModel.items;

    //mergine the global and the specific
    let vo                   = this.mergeModels(baseValidationModel, inValidationModel);

    //items already have propValue
    vo.propValue = this.getDeepValue(obj, vo.path);

    //check required firest
    if(vo.required && !vo.propValue){
      return this.createErrorObj('required', vo);
    }

    //remove non method vectors
    let validationVectors = this.getValidationVectors(vo);

    let errorObject       = null;

    for(let i=0; i<validationVectors.length; i++){

      let validationVectorName = validationVectors[i];
      errorObject = this.exec(validationVectorName, vo);

      if(errorObject)break;

    }

    return errorObject;

  }

  /**
    Passes every property and its validation to the evaluate
  */
  validate(obj, validationModels){
     let errors = [];
     for(let i=0; i<validationModels.length; i++){
       let error = this.evaluate(obj, validationModels[i]);
       if(error)errors.push(error);
     }
     return errors;
  }

}



module.exports = Pineapple;
