const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const app = require('../server');
const Todo = require('../models/todo');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe("Post /todos", () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            })
    });

    it('should not create todo with invalid body data', (done) => {
        let text = '';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done();
                }).catch((e) => done(e))
            })
    });
});

describe('get/todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    });
});

describe('get/todos:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123anh')
            .expect(404)
            .end(done)
    });
});

describe('delete /todos/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123anh')
            .expect(404)
            .end(done);
    });
});

describe('Patch todo/:id', () => {
    it('should update todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'This is a new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'This is a new text!!!!';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeFalsy()
            })
            .end(done)
    });
});

describe('Get /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if user isn\'t authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                // console.log(res.body)
                expect(res.body.message).toBe("no user found")
            })
            .end(done);
    })
})

describe('Post /users', () => {
    it('should create a user', (done) => {
        let email = 'ali@example.com'
        let password = '123mnb!'

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                console.log(res)
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(done)
    });

    // it(`should return validation errors if request is invalid`, (done) => {

    // })

    // it(`should not create user if email is in use`, (done) => {

    // })
})
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
*/
