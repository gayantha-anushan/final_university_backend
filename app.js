// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/Posts');
const mongoose = require('mongoose')

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/post-img", express.static(path.join(__dirname + '/routes/uploads')))
app.use('/profile',express.static(path.join(__dirname + '/routes/profiles')))




// make the database connection
//gayantha
//gaya.1234
//const mongo_url = "mongodb://localhost:27017/application_finals";
const mongo_url = "mongodb+srv://gayantha:gaya.1234@cluster0.7a6zy.mongodb.net/vege-sup?retryWrites=true&w=majority";
 
mongoose.connect(mongo_url,
  {
    autoIndex:false,
    useUnifiedTopology:true,
    useNewUrlParser:true
  });

const db = mongoose.connection;

db.once("open" , () => {
    console.log("Connection successful");
})

app.use('/', indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/posts' , postRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
