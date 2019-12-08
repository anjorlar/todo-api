const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const app = require('../server');
const Todo = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done())
});
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
                expect(res.body.text).toBe(text)
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
    })

    it('should not create todo with invalid body data', (done) => {
        let text = ''
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
    })

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    })

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
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeUndefined();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found', (done) => {

    });

    // it('should return 404 if object id is invalid', (done) => {

    // })
});

// git commit -a -m 'adde new test case and route'

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
*/
