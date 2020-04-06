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


### Advanced Example

```

//validation schema
let validationModels = [
  {
    model: 'name',
    regex: /^([a-zA-Z0-9\s]{3,50})$/
  },
  {
    model: 'mobile',
    required: false,
  },
  {
    model: 'age',
    type: 'Number',
  },
  {
    model: 'skills',
    type: 'Array',
    length: {max:5},
    items: {
      type: 'String',
      length: { min: 3, max: 50}
    }
  },
  {
    model: 'gender',
    type: 'String',
    oneOf: ['male', 'female'],
  },
  {
    model: 'books',
    type: 'Array',
    items: [

      {
        path: 'title',
        type: 'String',
        required: true,
      },
      {
        path: 'prints',
        type: 'Array',
        items: [
          {
            path: 'country',
            type: 'String',
          },
          {
            path: 'release.date',
            canParse: 'date'
          }
        ]
      }

    ]
  }


]

// user object
let userInput = {
  user: {
    name: 'bahi hussein',
    age: '19',
    skills: ['coding','drawing', 'ts'],
    games: [
      {title: 'outlast', score: 80},
      {title: 'red alert', score: 100},
    ],
    gender: 'ninja',
    books: [
      {
        title: 'bezzels',
        prints: [
          {
            country: 'egypt',
            release:{
              date: 1586193356622
            },
          },
          {
            country: 'uk',
            release:{
              date: 'king toot'
            },
          }
        ]
      }
    ],

    adult: true,

  }
}


//model reference
let modelReference = [
  { model: 'name', path: 'user.name'},
  { model: 'mobile', path: 'user.mobile', required: true},
  { model: 'age', path: 'user.age' },
  { model: 'skills', path: 'user.skills' },
  { model: 'gender', path: 'user.gender' },
  { model: 'books',  path: 'user.books' },
]

let pineapple = new Pineapple(validationModels);

let result = pineapple.validate(userInput, modelReference);

```

console.log(JSON.stringify(result))

```
[
   {
      "label":"user.mobile",
      "path":"user.mobile",
      "message":"user.mobile is required",
      "log":"_required",
      "errors":[

      ]
   },
   {
      "label":"user.age",
      "path":"user.age",
      "message":"user.age invalid type",
      "log":"_type",
      "errors":[

      ]
   },
   {
      "label":"user.skills",
      "path":"user.skills",
      "message":"one of the user.skills items is invalid",
      "log":"_length @index(2)",
      "errors":[

      ]
   },
   {
      "label":"user.gender",
      "path":"user.gender",
      "message":"user.gender invalid option",
      "log":"_oneOf",
      "errors":[

      ]
   },
   {
      "label":"user.books",
      "path":"user.books",
      "message":"one of the user.books items is invalid",
      "log":"_items @index(0)",
      "errors":[
         {
            "label":"prints",
            "path":"prints",
            "message":"one of the prints items is invalid",
            "log":"_items @index(1)",
            "errors":[
               {
                  "label":"release.date",
                  "path":"release.date",
                  "message":"release.date invalid parsing",
                  "log":"_canParse",
                  "errors":[

                  ]
               }
            ]
         }
      ]
   }
]

```
