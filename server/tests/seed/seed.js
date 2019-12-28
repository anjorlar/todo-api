const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const Todo = require('./../../models/todo');
const User = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'ade@example.com',
    password: 'userone',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'ajy@example.com',
    password: 'usertwo'

}];

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
        .catch(e => console.log("todo error", e))
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done())
        .catch(e => console.log('user error', e))
};
module.exports = {
    todos, populateTodos, users, populateUsers
};