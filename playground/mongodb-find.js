// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`unable to connect to mongo db server ${err}`)
    }
    console.log(`connected to mongodb server`);
    let db = client.db('TodoApp');
    // db.collection('Todos').find({
    //     _id: new ObjectID('5ddfee346e2db1cccce87068')
    // }).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('unable to fetch todos', err)
    // });

    db.collection('Users').find({ name: "ayo" }).toArray().then((docs) => {
        console.log(`Users count: ${docs}`)
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('unable to fetch todos', err)
    });
    // db.close()
});