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

const start = '<tr bgcolor="#ffffff">';

const singlehtmlTag = ['<td width="100" align="center">','</br>','<td width="50" align="center">','<td width="160">','<td width="120" align="center">',];

const closeTag = ['<br/>','</td>','</td>','<br/>','<br/>'];

const url = 'https://ipoget.com/ipodiary/%E3%82%BD%E3%83%95%E3%83%88%E3%83%90%E3%83%B3%E3%82%AF%EF%BC%889434%EF%BC%89ipo%EF%BC%88%E6%96%B0%E8%A6%8F%E4%B8%8A%E5%A0%B4%EF%BC%89%E3%81%AB%E5%BD%93%E9%81%B8%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81/'

const dom = client.fetch(url);

dom.then((result)=>{
  const count = (result.body.match(new RegExp(start,"g"))||[]).length;//この回数分繰り返す。
  singleData(result);
  doubleData(result);
});

//普通のデータをとるときの文字列処理
//forEachで回す
const singleData = (result)=>{ //配列
  let html = result.body;
  let startIndex = html.indexOf(start);//16570
  //ここの第2引数にfinal_countで</tr>のindexを受け渡す。
  let dayHtml=singlehtmlTag[i];
  let dayIndex = html.indexOf(dayHtml,startIndex);
  let closeTagIndex = html.indexOf(closeTag[i],dayIndex);
  console.log(html.substring(dayIndex+dayHtml.length,closeTagIndex));
  console.log(html.substring(dayIndex+day));
};

//hrefタグの文字列処理
//forEachで回す
const stockName = (result)=>{
  let html = result.body;
  let startIndex = html.indexOf(start);
  let hrefHtml = '<a href=';
  let hrefIndex = html.indexOf(hrefHtml,startIndex);
  let closeTagIndex = html.indexOf('</a>',hrefIndex);
  let href = '<a href="https://ipoget.com/?p=qqqqq" target="_blank">';
  console.log(html.substring(hrefIndex+href.length,closeTagIndex));
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
