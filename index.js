const fs = require('fs')
const request = require('request')
const Indexor = require('./modules/indexor')

let indexor = new Indexor('data/fact.json')
console.log(indexor.query('korea'))
