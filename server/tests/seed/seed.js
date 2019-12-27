const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const Todo = require('./../../models/todo');
const User = require('./../../models/user');

const userOneId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'ade@example.com',
    password: '12345678',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123')
    }]
}, {

}]

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}];

const populateTodos = (done) => {
    // Todo.remove({}).then(() => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done())
};

module.exports = {
    todos, populateTodos
}