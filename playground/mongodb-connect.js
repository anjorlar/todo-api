// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`unable to connect to mongo db server ${err}`)
    }
    console.log(`connected to mongodb server`);

    const db = client.db('TodoApp')

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(`unable to insert tode`, err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    db.collection('Users').insertOne({
        name: 'Ade bayo',
        age: 21,
        location: 'Lagos'
    }, (err, result) => {
        if (err) {
            return console.log(`unable to insert Users`, err)
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    })
    client.close();
});