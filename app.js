// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/Posts');
var reportRouter = require('./routes/report');
var adminRouter = require('./routes/admin');
var cartRouter = require('./routes/cart');
var NotificationRouter = require('./routes/Notifications')
var salesRouter = require('./routes/sales');
var stockRouter = require('./routes/stock');
const mongoose = require('mongoose');
var chat = require('./routes/Chat');
var recordRouter = require('./routes/Records');

var auctionRouter = require('./routes/auction');

var app = express();

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/post-img", express.static(path.join(__dirname + '/routes/uploads')))
app.use('/profile',express.static(path.join(__dirname + '/routes/profiles')))

const mongo_url = "mongodb+srv://gayantha:gaya.1234@cluster0.7a6zy.mongodb.net/vege-sup-test-ppp?retryWrites=true&w=majority";
//const mongo_url = "mongodb+srv://gayantha:gaya.1234@cluster0.7a6zy.mongodb.net/vege-sup?retryWrites=true&w=majority";

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
app.use('/api/reports' , reportRouter);
app.use('/api/admin' , adminRouter);
app.use('/api/cart' , cartRouter);
app.use('/api/sales' , salesRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/notice', NotificationRouter);
app.use('/api/stock' , stockRouter);
app.use('/api/chat', chat)
app.use('/api/record',recordRouter)


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
