const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

let id = '5de69a4f8f3fb175d4494674';

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos)
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todos', todo)
});