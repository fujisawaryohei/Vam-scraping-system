var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request-promise');
var apiRouter = require('./routes');
var highPrice = require('./highPrice'); //ファイルモジュール呼び出し

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', apiRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.listen(3000,function(){
  console.log("Listening on 3000-------------------------------");
});


app.get('/',(req,res)=>{
  res.send("これは新高値銘柄の情報を返すJSON APIです。")
});

app.get('/stockname',(req,res)=>{
  highPrice.stockNameArray(highPrice.url,highPrice.extractName).then(value=>{
    res.send(value);
  });
});

app.get('/marketandkind',(req,res)=>{
  highPrice.stockNameArray(highPrice.url,highPrice.extractMarket).then(value=>{
    res.send(value);
  });
});

app.get('/finalbalance',(req,res)=>{
  highPrice.stockNameArray(highPrice.url,highPrice.extractFinalBalance).then(value=>{
    res.send(value);
  });
});

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status=404;
  next(err);
})

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
