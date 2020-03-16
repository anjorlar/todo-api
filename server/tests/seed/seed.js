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
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'ajy@example.com',
    password: 'usertwo',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    // Todo.remove({}).then(() => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done())
        .catch(e => console.log("todo error", e));
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

//mongodb://anjy:oluwatomisn@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false
// git commit -a -m 'adde new test case and route' correct command
// git commit -am 'added new file' correct command

// Users-MBP:~ user$ cd mongo
// Users-MBP:mongo user$ cd bin
// Users-MBP:bin user$ ./mongod --dbpath ~/mongo-data
// db.createUser({"user": "anjy", "pwd": "oluwatomisn", "roles": ["readWrite"], "db": "oda"})

// db.createUser({"user": "anjy", "pwd": "oluwatomisn","roles": [{ "role": "readWrite", "db": "admin" }],"passwordDigestor": "server"})

// db.createUser({"user": "anjy","pwd": "oluwatomisn","roles": [ { "role": "userAdminAnyDatabase", "db": "admin" } ],"passwordDigestor": "server"})


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

udemy zero to mastery 132 to 248

*/