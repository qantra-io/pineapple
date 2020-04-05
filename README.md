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


let errors = pineapple.validate(
  {
    user: {
      name: '@Ft~U64l 4o94V'
    }
  },

  {
    model: 'fullname',
    path: 'user.name'
  },

);


```

console.log(errors) output

```
[
 {
   label: 'Fullname',
   path: 'user.name',
   message: 'Fullname has invalid format',
   log: '_regex',
   errors: []
 }
]
```







```
