const fs = require('fs')
const elasticlunr = require('elasticlunr')

class indexor {

  constructor(filePath, fields, generateDocument) {
    this.index = this.createIndex(fields)
    if (generateDocument) {
      this.data = this.parseData(filePath)
      this.generateDocument()
    }
  }

  createIndex(fields) {
    return elasticlunr(function () {
      for (let fieldName of fields) {
        this.addField(fieldName)
      }
      this.setRef('id')
    })
  }

  query(str) {
    let res = []
    let indexDump = JSON.parse(fs.readFileSync('data/indexor.json', 'utf8'))
    this.index = elasticlunr.Index.load(indexDump)
    for (let index of this.index.search(str)) {
      let temp = this.index.documentStore.docs[index.ref]
      temp.score = index.score
      temp.truthiness = this.getTruthiness(temp)
      temp.isVisible = true
      res.push(temp)
    }
    return res
  }

  getTruthiness(fact) {
    if (fact.authenticity === 'False' || fact.authenticity === 'Mostly False' || fact.authenticity === 'Pants on Fire!') {
      return 'false'
    }
    else if (fact.authenticity === 'true' || fact.authenticity === 'Mostly True' || fact.authenticity === 'True') {
      return 'true'
    }
    else {
      return 'halfTrue'
    }
  }

  /* PARSE & GENERATE DOCUMENT
 ========================================================================== */
  parseData(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  generateDocument() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].id = i
      this.index.addDoc(this.data[i])
    }
    fs.writeFile('data/indexor.json', JSON.stringify(this.index), function (err) {
      if (err) throw err;
    });
  }
}


module.exports = indexor