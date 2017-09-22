const fs = require('fs')
const elasticlunr = require('elasticlunr')

class indexor {
  constructor(filePath) {
    this.data = this.parseData(filePath)
    this.index = this.createIndex()
    this.generateDocument()
  }


  parseData(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  createIndex() {
    return elasticlunr(function () {
      this.addField('content');
      this.addField('author');
      this.addField('date');
      this.addField('authenticity');
      this.addField('title');
      this.setRef('id');
    })
  }

  generateDocument() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].id = i
      this.index.addDoc(this.data[i])
    }
  }

  query (str) {
    return this.index.search(str)
  }


}

module.exports = indexor