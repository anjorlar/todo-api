const { ObjectID } = require('mongodb');
const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/todo');
const user = require('../server/models/user');

let id = '5de69a4f8f3fb175d4494675';

if (!ObjectID.isValid(id)) {
    console.log('id not valid');
}
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos find', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todos findone', todo)
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('could not fetch todo');
    }
    console.log("todo by id", todo);
});

user.findById('5de53704abd865617f0b0c85').then((user) => {
    if (!user) {
        return console.log('id not found');
    }
    console.log('user by id ', user);
}).catch((e) => console.log(e));