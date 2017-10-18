const Indexor = require('../modules/indexor')

new Indexor('data/fact.json', ["content", "author", "date", "authenticity", "title"], true)