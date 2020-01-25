// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`unable to connect to mongo db server ${err}`)
    };
    console.log(`connected to mongodb server`);

    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        _id: new Object("5ddc20fefc422a44f25ee946")
    }, {
        $set: {
            name: 'Anjola'
        },
        $inc: {
            age: 1
        }
    },
        {
            returnOriginal: false
        }).then((result) => {
            console.log(result)
        })
    client.close();
});