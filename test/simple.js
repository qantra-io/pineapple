let Pineapple = require('../index.js');
const models = {
      fullname: {
        type: 'string',
        custom: 'fullname',
        depndent: 'user.age',
        customError: 'you must enter full name'
      },
    }
  
let pine = new Pineapple({models, customValidators: { 
    fullname: (data, vm) => {
        if (data.split(' ').length < 3) {
          return false;
        }
        return true;
      }}});

const run = async ()=>{
    let schema = [
        /** will fail in length */
        {
          path: 'user.firstname',
          label: 'First Name',
          length: { min:3 , max: 8 },
        },
        /** will fail in regex*/
        {
            path: 'user.email',
            label: 'Email',
            regex: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
        },
        /** will fail in type */
        {
            path: 'user.age',
            label: 'Age',
            type: 'Number',
        },
        /** will fail in option */
        {
            path: 'user.gender',
            oneOf: ['male','female'],
            required: true,
        },
        /** will fail in reqiured */
        {
            path: 'user.licenseId',
            label: 'license Id',
            required: true,
        },
         /** will fail in gte */
        {
            path: 'user.workExperience',
            label: 'work experience',
            gte: 1,
        },
          /** will fail in lte */
        {
            path: 'user.sallary',
            label: 'sallary',
            lte: 5000,
        },
        /** will fail in custom with custom error message */
        {
            path: 'user.fullname',
            label: 'fullname',
            model: 'fullname',
        }
      ]
      
      let payload = {
        user: {
            firstname: 'bahi hussein abdel baset',
            email: 'jumbo@mumbo@shit',
            age: 'twelve',
            gender: 'monkey',
            licenseId: '',
            workExperience: 0,
            sallary: 10000,
            fullname: 'bahi'
        }
      }
      
      let error = await pine.validate(payload, schema);
      if(error){
        console.log(error);

        /***
         * [
            {
                label: 'First Name',
                path: 'user.firstname',
                message: 'First Name has invalid length',
                log: '_length',
                errors: []
            },
            {
                label: 'Age',
                path: 'user.age',
                message: 'Age invalid type',
                log: '_type',
                errors: []
            },
            {
                label: 'user.gender',
                path: 'user.gender',
                message: 'user.gender invalid option',
                log: '_oneOf',
                errors: []
            },
            {
                label: 'license Id',
                path: 'user.licenseId',
                message: 'license Id is required',
                log: '_required',
                errors: []
            }
            ]
         */
      }
}


run();