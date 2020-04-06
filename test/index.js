
const debug      = require('debug')('qantra:pineapple:test');
const assert     = require('assert');
const Juice      = require('qantra-juice');
const Pineapple  = require('../pineapple');
const expect     = require('expect.js');

const charSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '1234567890',
  special: '@%+!#$?:~'
}

const combos = {
  'lowercase': ['lowercase'],
  'uppercase': ['uppercase'],
  'numbers': ['numbers'],
  'alpha-numeric': ['lowercase','uppercase','numbers'],
  'complex': ['lowercase','uppercase','numbers','special'],
  'lowercase-alpha-numeric': ['lowercase', 'numbers'],
  'uppercase-alpha-numeric': ['uppercase', 'numbers']
}

const templates = {
  'valid-fullname': [{'alpha-numeric':8}, ' ', {'alpha-numeric': 5}],
  'invalid-length-fullname': [{'alpha-numeric':1}, ' '],
  'invalid-length-fullname-2': [{'alpha-numeric':51}, ' ', {'alpha-numeric':51}],
  'invalid-num-fullname': [{'numbers':8}, ' ', {'numbers': 5}],
  'invalid-regex-fullname': [{'complex':8}, ' ', {'alpha-numeric': 5}],
  'valid-email': [{ 'lowercase-alpha-numeric': 10 }, '@gmail.com'],
  'invalid-regex-email': [".", { 'lowercase': 3 }, '@gmail.com',],
  'invalid-length-email': [{ 'lowercase': 30 }, '@gmail.com',],
  'valid-address': [{'alpha-numeric': 20}],
  'invalid-address': [{'alpha-numeric': 50}]

}

let juice = new Juice(charSets, combos, templates);


// FIRST SCHEMA TESTING

const validationSchemaOne = [
    {

        model: 'fullname',
        required: true,
        label: 'Fullname',
        type: 'String',
        length: {min: 3, max:100},
        regex: /^([a-zA-Z0-9\s]{3,100})$/,

    },
];

let pineapple = new Pineapple(validationSchemaOne);

let model     =   [
    {model: 'fullname', path: 'user.name'},
];

// validation of format (regex)
describe('Pineapple', function() {
  describe('#validate() #regex', function() {

    it('should not return an error on a valid fullname', function(done) {

      let payload = { user: {name: juice.model('valid-fullname') }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an invalid regex fullname', function(done) {

      let payload = { user: {name: juice.model('invalid-regex-fullname') }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_regex');
      done();

    });
  });
});

// validation of require
describe('Pineapple', function() {
  describe('#validate() #require', function() {

    it('should return an error on an empty input ', function(done) {

      let payload = { user: {name:''}};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();

    });
  });
});

// validation of type
describe('Pineapple', function() {
  describe('#validate() #type', function() {

    it('should return an error on a number input ', function(done) {

      let payload = { user: {name: parseInt(juice.model('invalid-num-fullname')) }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on a boolean input ', function(done) {

      let payload = { user: {name: true }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on an array input ', function(done) {

      let payload = { user: {name: juice.model('valid-fullname').split(" ") }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// validation of length
describe('Pineapple', function() {
  describe('#validate() #length', function() {

    it('should return an error on an input below min length requirements', function(done) {

      let payload = { user: {name: juice.model('invalid-length-fullname') }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });

    it('should return an error on an input exceeds max length requirements ', function(done) {

      let payload = { user: {name: juice.model('invalid-length-fullname-2') }};
      let errors = pineapple.validate(payload, model);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });
  });
});


// SECOND SCHEMA TESTING

const validationSchemaTwo = [
    {

        model: 'email',
        required: true,
        label: 'Email',
        type: 'String',
        length: {min: 12, max:25},
        regex:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
];

let pineappleTwo = new Pineapple(validationSchemaTwo);

let modelTwo     =   [
    {model: 'email', path: 'user.email'},
];

// validation of format (regex)
describe('pineappleTwo', function() {
  describe('#validate() #regex', function() {

    it('should not return an error on a valid email', function(done) {

      let payload = { user: {email: juice.model('valid-email') }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an invalid regex email', function(done) {

      let payload = { user: {email: juice.model('invalid-regex-email') }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_regex');
      done();
    });
  });
});

// validation of require
describe('PineappleTwo', function() {
  describe('#validate() #require', function() {

    it('should return an error on an empty input ', function(done) {

      let payload = { user: {email:''}};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of length
describe('pineappleTwo', function() {
  describe('#validate() #length', function() {

    it('should return an error on an invalid length email', function(done) {

      let payload = { user: {email: juice.model('invalid-length-email') }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });
  });
});

// validation of type
describe('pineappleTwo', function() {
  describe('#validate() #type', function() {

    it('should return an error on a numeric input', function(done) {

      let payload = { user: {email: 1006 }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on a boolean input', function(done) {

      let payload = { user: {email: true }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on an input array ', function(done) {

      let payload = { user: {email: juice.model('valid-email').split("") }};
      let errors = pineappleTwo.validate(payload, modelTwo);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// THIRD SCHEMA TESTING

const validationSchemaThree = [
    {
      model: 'gender',
      required: true,
      type: 'String',
      oneOf: ['male','female']
    },
];

let pineappleThree = new Pineapple(validationSchemaThree);

let modelThree     =   [
    {model: 'gender', path: 'user.gender'},
];

// validation of requirement
describe('pineappleThree', function() {
  describe('#validate() #require', function() {

    it('should not return error on an existed gendr', function(done) {

      let payload = { user: {gender: "female"}};
      let errors = pineappleThree.validate(payload, modelThree);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an empty input', function(done) {

      let payload = { user: {gender: "" }};
      let errors = pineappleTwo.validate(payload, modelThree);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleThree', function() {
  describe('#validate() #type', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {gender: 0000 }};
      let errors = pineappleTwo.validate(payload, modelThree);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// validation of oneOf
describe('pineappleThree', function() {
  describe('#validate() #oneOf', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {gender: "males" }};
      let errors = pineappleTwo.validate(payload, modelThree);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_oneOf');
      done();
    });
  });
});

// FOURTH SCHEMA TESTING

const validationSchemaFour = [
    {
        model: 'language',
        required: true,
        type: 'String',
        length: 2,
        oneOf: ['en','ar'],
    }
];

let pineappleFour = new Pineapple(validationSchemaFour);

let modelFour     =   [
    {model: 'language', path: 'user.language'},
];

// validation of requirement
describe('pineappleFour', function() {
  describe('#validate() #require', function() {

    it('should not return error on an existed language', function(done) {

      let payload = { user: {language: "en"}};
      let errors = pineappleFour.validate(payload, modelFour);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an empty input', function(done) {

      let payload = { user: {language: "" }};
      let errors = pineappleFour.validate(payload, modelFour);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleFour', function() {
  describe('#validate() #type', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {language: 12 }};
      let errors = pineappleFour.validate(payload, modelFour);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// validation of length
describe('pineappleFour', function() {
  describe('#validate() #length', function() {

    it('should return an error on an invalied length of an input', function(done) {

      let payload = { user: {language: 'eng' }};
      let errors = pineappleFour.validate(payload, modelFour);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });
  });
});

// validation of oneOf
describe('pineappleFour', function() {
  describe('#validate() #oneOf', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {language: "an" }};
      let errors = pineappleFour.validate(payload, modelFour);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_oneOf');
      done();
    });
  });
});


// FOURTH SCHEMA TESTING

const validationSchemaFive = [
    {
        model: 'date',
        label: 'date',
        required: true,
        type: 'Number',
        canParse: 'date'
    }
];

let pineappleFive = new Pineapple(validationSchemaFive);

let modelFive     =   [
  { model: 'date', path: 'user.date'}
];

// validation of requirement
describe('pineappleFive', function() {
  describe('#validate() #require', function() {

    it('should not return error on an existed date', function(done) {

      let payload = { user: {date: 6565258258528 }};
      let errors = pineappleFive.validate(payload, modelFive);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an empty input', function(done) {

      let payload = { user: {date: 0 }};
      let errors = pineappleFive.validate(payload, modelFive);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleFive', function() {
  describe('#validate() #type', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {date: "474674676497649" }};
      let errors = pineappleFive.validate(payload, modelFive);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on an wrong input type (boolean) ', function(done) {

      let payload = { user: {date: true }};
      let errors = pineappleFive.validate(payload, modelFive);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// validation of canParse
describe('pineappleFive', function() {
  describe('#validate() #canParse', function() {

    it('should return an error on an input can not parse', function(done) {

      let payload = { user: {date: -6565258258528 }};
      let errors = pineappleFive.validate(payload, modelFive);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_canParse');
      done();
    });
  });
});


// sixth SCHEMA TESTING

const validationSchemaSix = [
    {
       model: 'countries',
       label: 'Countries',
       required: true,
       type: 'String',
       oneOf: ['egypt','oman','usa']
   }
];

let pineappleSix = new Pineapple(validationSchemaSix);

let modelSix     =   [
    {model: 'countries', path: 'user.countries'},
];

// validation of requirement
describe('pineappleSix', function() {
  describe('#validate() #require', function() {

    it('should not return error on an existed country', function(done) {

      let payload = { user: {countries: "usa"}};
      let errors = pineappleSix.validate(payload, modelSix);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an empty input', function(done) {

      let payload = { user: {countries: "" }};
      let errors = pineappleSix.validate(payload, modelSix);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleSix', function() {
  describe('#validate() #type', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {countries: 12 }};
      let errors = pineappleSix.validate(payload, modelSix);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {countries: "usa".split() }};
      let errors = pineappleSix.validate(payload, modelSix);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});


// validation of oneOf
describe('pineappleSix', function() {
  describe('#validate() #oneOf', function() {

    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {countries: "an" }};
      let errors = pineappleSix.validate(payload, modelSix);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_oneOf');
      done();
    });
  });
});

// SEVENTH SCHEMA TESTING

const validationSchemaSeven = [
  {
      model: 'address',
      label: 'shipping address',
      required: true,
      type: 'String',
      length: {min:10, max:40}
  }
];

let pineappleSeven = new Pineapple(validationSchemaSeven);

let modelSeven     =   [
    {model: 'address', path: 'user.address'},
];

// validation of requirement
describe('pineappleSeven', function() {
  describe('#validate() #require', function() {

    it('should not return error on an existed country', function(done) {

      let payload = { user: {address: juice.model('valid-address') }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();

    });

    it('should return an error on an empty input', function(done) {

      let payload = { user: {address: "" }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleSeven', function() {
  describe('#validate() #type', function() {

    it('should return an error on an wrong input type', function(done) {

      let payload = { user: {address: 1276746 }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
    it('should return an error on an wrong input type ', function(done) {

      let payload = { user: {address: juice.model('valid-address').split() }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});


// validation of length
describe('pineappleSeven', function() {
  describe('#validate() #length', function() {

    it('should return an error on an invalid length below min ', function(done) {

      let payload = { user: {countries: "shash" }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });

    it('should return an error on an invalid length exceeds max ', function(done) {

      let payload = { user: {countries: juice.model('invalid-address') }};
      let errors = pineappleSeven.validate(payload, modelSeven);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_length');
      done();
    });
  });
});

// EIGHTH SCHEMA TESTING

const validationSchemaEight= [
  {
    model: 'geo',
    required: true,
    type: 'Array',
    items: [
      {
        type: 'Array',
        path: 'user.geo[0].lat',
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
        path: 'user.geo[0].lng',
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
  }
];

let pineappleEight = new Pineapple(validationSchemaEight);

let modelEight     =   [
  {model: 'geo', path: 'user.geo'},
];

// validation of require
describe('pineappleEight', function() {
  describe('#validate() #require', function() {

    it('should not return an error on an existed location', function(done) {

      let payload = { user: {geo: [ {
        lat:['aaaaa','eaaaa','eaaaa'],
        lng:[{lng: '1hhhf'}]
        }
     ]}
   };
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(0);
      done();
    });

    it('should return an error on an empty input ', function(done) {

      let payload = { user: {geo:''}};
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_required');
      done();
    });
  });
});

// validation of type
describe('pineappleEight', function() {
  describe('#validate() #type', function() {

    it('should return an error on a string type input', function(done) {

      let payload = { user: {geo:'string'}};
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });

    it('should return an error on a string type input', function(done) {

      let payload = { user: {geo: 090909}};
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_type');
      done();
    });
  });
});

// validation of items
describe('pineappleEight', function() {
  describe('#validate() #items', function() {


    it('should return an error on a lat item', function(done) {

      let payload = { user: {geo: [ {
        lat:['aaaaa','eaaaa','eaaaa'],
        lng:[{lng: '1hhhf'}]
        }
     ]}
   };
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_item');
      done();
    });

    it('should return an error on a lng item', function(done) {

      let payload = { user: {geo: [ {
        lat:['aaaaa','eaaaa','eaaaa'],
        lng:[{lng: '1hhhf'}]
        }
     ]}
   };
      let errors = pineappleEight.validate(payload, modelEight);
      debug(payload);
      debug('errors',errors);
      expect(errors).to.be.an('array');
      expect(errors).to.have.length(1);
      expect(errors[0].log).to.equal('_item');
      done();
    });
  });
});
