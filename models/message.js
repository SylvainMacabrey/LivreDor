let connection = require('../config/connection')
let moment = require('../config/moment')

class Message {

    constructor(row) {
        this.row = row
    }

    get id() {
        return this.row.id
    }

    get content() {
        return this.row.content
    }

    get created() {
        return moment(this.row.created)
    }

    static create(content, callback) {
        connection.query('INSERT INTO messages SET content = ?, created = ?', [content, new Date()], (err, result) => {
            if(err) throw err
            callback(result)
        })
    }

    static all(callback) {
        connection.query('SELECT * FROM messages', (err, rows) => {
            if(err) throw err
            callback(rows.map((row) => new Message(row)))
        })
    }

    static find(id, callback) {
        connection.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if(err) throw err
            callback(new Message(rows[0]))
        })
    }

}

module.exports = Message