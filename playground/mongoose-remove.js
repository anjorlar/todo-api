const { ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/todo');
const user = require('../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res)
// });

// Todo.findOneAndRemove({
//     _id: '5de934cbb2d32d586f234304'
// }).then((todo) => {
//     console.log(todo)
// });

Todo.findByIdAndRemove('5de9349bb2d32d586f2342e8').then((todo) => {
    console.log(todo)
})