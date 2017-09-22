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
                this.addField(fieldName);
            }
            this.setRef('id');
        })
    }

    generateDocument() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].id = i
            this.index.addDoc(this.data[i])
        }
    }

    query(str) {
        return this.index.search(str)
    }

}

module.exports = indexor