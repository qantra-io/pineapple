const validationModels = [
  {model: 'name', label: 'your name', path: 'name.kill'},
  {model: 'email', label: 'user email address', path: 'email'},
  {model: 'date', path: 'birth'},
  {model: 'gender',path: 'gender', required: false},
  {model: 'language', path: 'language'},
  {model: 'arrayOfStrings', path: 'info.skills'},
  {model: 'address', path: 'shipping.address'},
  {model: 'countries', path: 'shipping.country', required: true,
    onError: {
      required: `$label is required for a product to be shipped`,
    }
  },
  {model: 'address', path: 'pick.location'},
  {model: 'geo', path: 'geolocation', required: true},
]
const validationSchema = [

    {

        model: 'name',
        required: true,
        label: 'name',
        type: 'String',
        length: {min: 1, max:2}

    },
    {
        model: 'email',
        label: 'email address',
        required: true,
        type: 'String',
        length: {min:100, max:100},
        regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    {
        model: 'date',
        label: 'date',
        required: false,
        type: 'Number',
        canParse: 'date'
    },
    {
        model: 'gender',
        required: true,
        type: 'Number',
        oneOf: ['male','female'],
    },
    {
        model: 'language',
        required: true,
        type: 'String',
        oneOf: ['en','ar'],
    },
    {
        model: 'arrayOfStrings',
        required: true,
        type: 'Array',
        items:{
          type:'String',
          length: {min:8, max:100}
        }
    },
    {
      model: 'geo',
      required: true,
      type: 'Array',
      items: [
        {
          type: 'Array',
          path: 'lat',
          required: true,
          items:{
              type: 'String',
              path: 'lat',
              required: true,
              length: 5
          }
        },
        {
          type: 'Array',
          path: 'lng',
          required: true,
          items: [
            {
              type: 'String',
              path: 'lng',
              required: true,
              length: 5
            }
          ]
        }
      ]
    },
    {
        model: 'countries',
        label: 'Countries',
        type: 'String',
        oneOf: ['egypt','oman','usa']
    },
    {
        model: 'address',
        label: 'shipping address',
        type: 'String',
        length: {min:8, max:100}
    },

];

const obj = {
    name: 'bahi',
    email: 'bahi.hussein@gmail.com',
    gender: 'male',
    birth: 1554112180214,
    language: 1,

    pick: {
        location: 'Area 32, Zone 43'
    },

    info: {
        skills: ['coding','eating', 'sleeping']
    },

    shipping: {
        country: 'Egypt'
    },
    geolocation: [
      {
        lat:['a','e','e'],
        lng:[{lng: '1'}]
      }
    ]
};

let pineapple = new Pineapple(validationSchema);

let result = pineapple.validate(obj, validationModels);

console.log(JSON.stringify(result))
