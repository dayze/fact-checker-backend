let express = require('express') // "framework" node js to easily implement web server

const Indexor = require('./modules/indexor')

//let hbs = require('hbs') // templating, twig like

let app = express() // initialize of express, option may be passed, basic for now
//hbs.registerPartials(__dirname + '/views/partials') // indicate where are stored the part of hbs template
//app.set('view engine', 'hbs') // tell express that we use hbs for templating
app.use(express.static(__dirname + '/public')) // tell express where is the folder that will be access by users
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search/:q', (request, response) => {
  let indexor = new Indexor('data/fact.json', ["content", "author", "date", "authenticity", "title"])
  response.send(indexor.query(request.params.q))
})

let listener = app.listen(4000, () => {
  console.log('server is running on: ', listener.address().port)
})
