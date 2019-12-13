require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const user = require('./models/user');

const app = express();

const PORT = process.env.PORT || 3000;
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
        res.send({
            message: "todo created successfully",
            doc
        })
    }).catch((e) => res.status(400).send(e))
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            message: 'all todo gotten successfully',
            todos
        })
    }).catch((e) => res.status(400).status(e))
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'id is not valid'
        })
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                text: 'id does not exist'
            })
        }
        res.send({
            message: "todo gotten by ID successfully",
            todo
        });
    }).catch((err) => res.status(400).send(err))
    // res.send(req.params);
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'id is not valid'
        })
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                text: 'id does not exist'
            });
        }
        res.send({
            message: 'todo deleted by ID successfuly',
            todo
        });
    }).catch((e) => res.status(400).send(e))
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                text: 'id does not exist'
            });
        }
        res.status(200).send({
            message: 'todo updated successfully',
            todo
        })
    }).catch((e) => res.status(400).send({ text: `todo not found` }))
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});

module.exports = app;