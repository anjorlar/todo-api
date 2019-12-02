const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// let newTodo = new Todo({
//     text: "cook dinner"
// });

// let newTodo = new Todo({
//     text: "order lunch",
//     completed: false
// });

// newTodo.save().then((res) => {
//     console.log('todo saved', res)
// }).catch((e) => console.log('unable to save todo', e))

let anotherTodo = new Todo({
    text: '   new todo       '
});

anotherTodo.save().then((res) => {
    console.log(JSON.stringify(res, undefined, 2))
}).catch((err) => console.log("unable to save", err))