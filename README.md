# pineapple
advanced json object validator specially designed to validate user json input and return readable error messages

![alt text](./pineapple.jpg "juice")


# Install

```npm install qantra-pineapple```

# Simple Usuage

create a validation schema is an array of object containing validation models.
every model defines set of rules than need to be valid
on a property that will be defined.
```
const validationSchema = [
    {

        model: 'fullname',
        required: true,
        label: 'Fullname',
        type: 'String',
        length: {min: 3, max:100},
        regex: /^([a-zA-Z0-9\s]{3,100})$/,

    },
];

let pineapple = new Pineapple(validationSchema);  //create an instance with the defined schema list

let userInput = {
  user: {
    name: '@Ft~U64l 4o94V'
  }
};

let modelReference = {
  model: 'fullname',
  path: 'user.name'
};

let errors = pineapple.validate(userInput, modelReference);

console.log(errors);

```

the error result

```
/**
[
 {
   label: 'Fullname',
   path: 'user.name',
   message: 'Fullname has invalid format',
   log: '_regex',
   errors: []
 }
]
*/
```

# Validation Props

* **label**: label is useful for returning a user readable message
* **type**: can be 'string', 'number', 'array', 'object', 'boolean', 'date'
* **required**: true or false
* **length**: can be a number or object length: 5 , length: {min: 10, max: 100}
* **regex**: takes a regex expression to match
* **oneOf**: array of string from which the user value must be included ['male','female']
* **canParse**: takes a string 'int' , 'date' , 'float' check if a value can be parsed.
* **items**: validates array items and takes an a validation model reference object if validating array of strings of validation models reference array if validating array of objects


## items property validates items inside an array

```

//validation schema
let validationModels = [
  {
    model: 'skills',
    type: 'Array',
    length: {min: 1, max:5}, //from one to five skills only allowed
    //because the expected object is array of strings then the items property is a validation object
    items: {
      type: 'string', //items inside the array must be string,
      length: {min: 3, max: 6}, // character length of the items
    }
  }
]

// user object
let userInput = {
  user: {
    skills: ['coding','drawing']
  }
}


//model reference
let modelReference = [
  { model: 'skills', path: 'user.skills'}
]

let pineapple = new Pineapple(validationModels);

let result = pineapple.validate(userInput, modelReference);

```

console.log(result)

```
[ { label: 'user.skills',
    path: 'user.skills',
    message: 'one of the user.skills items is invalid',
    log: '_length @index(1)',
    errors: [] } ]

```
