
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
  'invalid-regex-fullname': [{'complex':8}, ' ', {'alpha-numeric': 5}],
  'email': [
    { 'lowercase-alpha-numeric': 10 },
    '@gmail.com',
  ],
}

let juice = new Juice(charSets, combos, templates);

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

let pineapple = new Pineapple(validationSchema);

let model     =   [
    {model: 'fullname', path: 'user.name'},
];

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
