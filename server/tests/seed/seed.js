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


// git commit -a -m 'adde new test case and route' correct command
// git commit -am 'added new file' correct command

// Users-MBP:~ user$ cd mongo
// Users-MBP:mongo user$ cd bin
// Users-MBP:bin user$ ./mongod --dbpath ~/mongo-data

/*
Last login: Mon Dec  2 13:08:22 on ttys006
Users-MBP:bin user$ redis-cli
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]>
Users-MBP:bin user$ redis-cli
127.0.0.1:6379> select 10
OK
127.0.0.1:6379[10]>
Users-MBP:bin user$
git add -a -m 'fixed typo in server.js'

udemy zero to mastery 172 to 248

*/