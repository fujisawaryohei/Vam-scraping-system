var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var client = require('cheerio-httpcli');
var request = require('request-promise');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
const {google} = require('googleapis');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.listen(3000,function(){
  console.log("Listening on 3000");
});
/*
var options = {
  url:'https://www.sejuku.net/blog/73698#request',
  method:'GET'
}
*/

//第１引数にURL,第2引数にquery,第3引数コールバック関数
var html = ['<td class="tac">','<td class="tal">','<td>','<td width="61">','<td width="50">'];

var cheerio = client.fetch('https://kabutan.jp/warning/?mode=3_1');
 cheerio.then((result)=>{
   stringNormal(result);
   stringHref(result);
 });

  function stringNormal(result){//銘柄名
    var body = result.body;
    var htmlIndex = body.indexOf(html[1]);
    var htmlLength = html[1].length;
    var closetagIndex = body.indexOf('</td>',htmlIndex);
    var stockname = body.substring(htmlIndex+htmlLength,closetagIndex);

    var stockhtml = body.indexOf(html[2],htmlIndex);
    var a = body.indexOf('</a>',stockhtml)
    var stockvalue = body.substring(stockhtml,a);
    console.log(stockname + ":" + stockvalue);
  }

  function stringHref(result){//株価コード
    var body = result.body;
    var htmlIndex = body.indexOf(html[0]);
    var href = '<a href="/stock/?code=????>"';
    var closetagIndex = body.indexOf('</a>',htmlIndex);
    var b = body.substring(htmlIndex+href.length+16,closetagIndex);
  }

  function stringSpan(){

  }

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
