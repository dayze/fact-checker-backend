const fs = require('fs')
const elasticlunr = require('elasticlunr')

class indexor {

  constructor(filePath, fields) {
    this.data = this.parseData(filePath)
    this.index = this.createIndex(fields)
    this.generateDocument()
  }

  parseData(filePath) {
    /* mode sync */
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  createIndex(fields) {
    return elasticlunr(function () {
      for (let fieldName of fields) {
        this.addField(fieldName)
      }
      this.setRef('id')
    })
  }

  generateDocument() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].id = i
      this.index.addDoc(this.data[i])
    }
  }

  query(str) {
    let res = []
    for (let index of this.index.search(str)) {
      let temp = this.index.documentStore.docs[index.ref]
      temp.score = index.score
      temp.truthiness = this.getTruthiness(temp)
      res.push(temp)
    }
    return res
  }

  getTruthiness(fact) {
    if(fact.authenticity === 'False' || fact.authenticity === 'Mostly False' || fact.authenticity === 'Pants on Fire!') {
      return 'false'
    }
    else if (fact.authenticity === 'true' || fact.authenticity === 'Mostly True' || fact.authenticity === 'True'){
      return 'true'
    }
    else {
      return 'halfTrue'
    }
  }
}

module.exports = indexor