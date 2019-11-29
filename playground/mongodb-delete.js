/** const MongoClient = require('mongodb').MongoClient */
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017//TodoApp', (err, client) => {
    if (err) {
        return console.log(`unable to connect to mongodb server`, `${err}`)
    }
    console.log('connected to mongodb server')
    let db = client.db('TodoApp')
    //deleleMany

    db.collection('Todos').deleteMany({ text: "Eat lunch" }).then((result) => {
        console.log(result)
    }, (err) => console.log('unable to delete todos', err))
    //deleteOne

    db.collection('Todos').deleteOne({ text: "Eat lunch" }).then((results) => {
        console.log(results)
    })
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({ completed: false }).then((results) => {
        console.log(results)
    })
    //db.close();
})