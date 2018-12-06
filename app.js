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

const url = 'http://www.miller.co.jp/applications/cgi-bin/cv0/rnk20/01/cv0rnk20c.cgi?_hps=off&id=4'
const start = '<td class="tLeft rkgSelected01">';

const dom = client.fetch(url);

//新高値銘柄
dom.then((result)=>{
  var body = result.body;
  var count = (body.match(new RegExp(start,"g")))||[].length;
  var startIndex = body.indexOf(start);
  var closeTag = body.indexOf('</a>',startIndex);
  var href = '<a href="/chart.cgi?????TB" target="_chart">';
  console.log(body.substring(startIndex + href.length + start.length,closeTag));
  });

//市場・業種
dom.then((result)=>{
  let body = result.body;
  let count = (body.match(new RegExp(start,"g")))||[].length;
  let startIndex = body.indexOf(start);
  let htmlTag = '<td class="tLeft ">';
  let htmlIndex =   body.indexOf(htmlTag,startIndex);
  let closeTag = ['<br />','</td>']
  let closeIndex1 = body.indexOf(closeTag[0],htmlIndex);
  let closeIndex2 = body.indexOf(closeTag[1],closeIndex1);
   console.log(body.substring(htmlIndex + htmlTag.length , closeIndex1));
   console.log(body.substring(htmlIndex + htmlTag.length + closeTag[1].length + closeTag[0].length-1 , closeIndex2));
});

//終値
dom.then((result)=>{
  let body = result.body;
  let count = (body.match(new RegExp(start,"g")))||[].length;
  let startIndex1 = body.indexOf(start);
  let htmlTag1 = '<td class="tRight " >';
  let htmlTag2 = '<strong>';
  let htmlIndex1 = body.indexOf(htmlTag1,startIndex1);
  let htmlIndex2 = body.indexOf(htmlTag2,htmlIndex1);
  let closeTagIndex1 = body.indexOf('<span',htmlIndex1);
  let closeTagIndex2 = body.indexOf('</strong>',htmlIndex2);
   let updown = body.substring(htmlIndex2 + htmlTag2.length,closeTagIndex2);
    console.log(body.substring(htmlIndex1 + htmlTag1.length,closeTagIndex1)+updown);
 // 前日比
 //出来高(千株)は後で
});


console.log();
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
