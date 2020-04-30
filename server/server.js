require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');
const authenticate = require('./middleware/authenticate');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// creates new todo
app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send({
            message: "todo created successfully",
            doc
        });
    }).catch((e) => res.status(400).send(e));
});

// route that gets all todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            message: 'all todo for the user gotten successfully',
            todos
        });
    }).catch((e) => res.status(400).status(e));
});

// route that gets todo by id
app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'id is not valid'
        });
    };
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                text: 'id does not exist'
            });
        };
        res.send({
            message: "todo gotten by ID successfully",
            todo
        });
    }).catch((err) => res.status(400).send(err));
    // res.send(req.params);
});

// deletes a single todo
app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            text: 'id is not valid'
        });
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                text: 'id does not exist'
            });
        }
        res.send({
            message: 'todo deleted by ID successfuly',
            todo
        });
    }).catch((e) => res.status(400).send(e));
});

// updates todos by id
app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    };
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    };
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    },
        { $set: body }, { new: true }).then((todo) => {
            if (!todo) {
                return res.status(404).send({
                    text: 'id does not exist'
                });
            }
            res.status(200).send({
                message: 'todo updated successfully',
                todo
            });
        }).catch((e) => res.status(400).send({ text: `todo not found` }));
});

// creates a new user and generates a token for that user
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
        // res.send({
        //     message: 'user created successfully',
        //     user
        // })
    }).then((token) => {
        res.header('x-auth', token).send({
            message: 'user created successfully',
            user
        })
    }).catch((err) => res.status(400).send({
        message: 'creating user was unsuccessful',
        err
    }));
});

/** route to login a user */
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
});
// route to get a single user with the generated token
app.get('/users/me', authenticate, (req, res) => {
    res.send(
        req.user
    );
});

app.get('/users', (req, res) => {
    User.find().then((user) => {
        res.send({
            message: 'all user gotten successfully',
            user
        })
    }).catch((e) => res.status(400).send(e))
});

/* deletes a user's token */
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({
            message: `token successfully deleted`
        });
    }).catch((e) => res.status(400).send({
        message: `error deleting token`,
        e
    }));
});

//port to listen on
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});

module.exports = app;