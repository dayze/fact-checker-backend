const fs = require('fs')
const moment = require('moment')
let data = fs.readFileSync('data/fact.json', 'utf8')
data= JSON.parse(data)
for (let item of data){
  item.date = item.date.replace('on ', '').replace(/, /g,' ')
  item.date = moment(item.date, 'ddd MMM D YYYY').format()
}
fs.writeFileSync('data/fact.json', JSON.stringify(data), 'utf8' )

