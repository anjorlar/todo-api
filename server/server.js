const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const user = require('./models/user');

const app = express();

app.use(bodyParser.json());

// let user = new User({
//     email: 'ade@hotmail.com'
// })

// user.save().then((docs) => {
//     console.log(JSON.stringify(docs, undefined, 2))
// }).catch((err) => console.log('unable to save', err))

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc)
    }).catch((e) => res.status(400).send(e))
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }).catch((e) => res.status(400).status(e))
});

app.get('/todos/:id', (req, res) => {
    res.send(req.params);
});
app.listen(3000, () => {
    console.log('app listening on port 3000')
});

module.exports = app;