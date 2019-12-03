const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const Todo = require('./db/mongoose');
const user = require('./db/mongoose');

const app = express();
// let newTodo = new Todo({
//     text: "order lunch",
//     completed: false
// });

// newTodo.save().then((res) => {
//     console.log('todo saved', res)
// }).catch((e) => console.log('unable to save todo', e))

// let anotherTodo = new Todo({
//     text: '   new todo       '
// });

// anotherTodo.save().then((res) => {
//     console.log(JSON.stringify(res, undefined, 2))
// }).catch((err) => console.log("unable to save", err))



// let user = new User({
//     email: 'ade@hotmail.com'
// })

// user.save().then((docs) => {
//     console.log(JSON.stringify(docs, undefined, 2))
// }).catch((err) => console.log('unable to save', err))

app.post('/todos', (req, res) => {

})

app.listen(3000, () => {
    console.log('app listening on port 3000')
})