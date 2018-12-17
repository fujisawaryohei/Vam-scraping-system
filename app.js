var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request-promise');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var highPrice = require('./highPrice'); //ファイルモジュール呼び出し
var app = express();
const {google} = require('googleapis');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.listen(3000,function(){
  console.log("Listening on 3000-------------------------------");
});

app.get('/stockname',(req,res)=>{
  highPrice.stockNameArray(highPrice.url,highPrice.extractName).then(value=>{
    res.send(value);
  }).catch(console.log("err!"));
});

// async stockname(){
//   var stock = await highPrice.stockNameArray(highPrice.url,highPrice.extractName);
// }.then((stock)=>{
//   console.log(stock);
// });

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status=404;
  next(err);
})


// //スクレイピングに必要な情報の定義
// var url = 'http://www.miller.co.jp/applications/cgi-bin/cv0/rnk20/01/cv0rnk20c.cgi?_hps=off&id=4';
// var start = '<td class="tLeft rkgSelected01">';
// var arrayBody = new Array;
// var htmlBody = new String;
// var stockArray = new Array;
//
// //stockArrayは銘柄HTML要素の配列を返す //第2引数では、抽出処理している関数を渡す
// function stockNameArray(link,callback) {
//   var dom = client.fetch(link);
//     dom.then((res)=>{
//       var body = res.body;
//       var count = (body.match(new RegExp(start,"g"))||[]).length;
//         for(var i=1;i <= count;i++) {
//           var htmlTag = `<td class="">${i}</td>`;
//           var startIndex = body.indexOf(htmlTag);
//           var closeIndex = body.indexOf('</tr>',startIndex);
//           htmlBody = body.substring(startIndex,closeIndex);
//           stockArray.push(htmlBody); //stockArrayが銘柄の配列.
//         }
//         callback(stockArray);
//     });
// }
//
// stockNameArray(url,extractName)
// //新高値銘柄と銘柄コード抽出
// function extractName(array){
//   for(var arr of array){
//     var startIndex = arr.indexOf(start);
//     var closeTag = arr.indexOf('</a>',startIndex);
//     var href = '<a href="/chart.cgi?????TB" target="_chart">';
//     var result = arr.substring(start.length + startIndex + href.length, closeTag)
//     return result;
//   }
// }
//
// //市場と業種の取得
// function extractMarket(array){
//   for(var arr of array){
//     var startIndex = arr.indexOf(start);
//     var htmlTag = '<td class="tLeft ">';
//     var htmlIndex = arr.indexOf(htmlTag,startIndex);
//     var closeTag = ['<br />','</td>']
//     var closeIndex1 = arr.indexOf(closeTag[0],htmlIndex);
//     var closeIndex2 = arr.indexOf(closeTag[1],closeIndex1);
//     console.log(arr.substring(htmlIndex + htmlTag.length , closeIndex1));     console.log(arr.substring(htmlIndex + htmlTag.length + closeTag[1].length + closeTag[0].length - 1 , closeIndex2));
//   }
// }
//
// //終値を取得
// function extractFinalBalance(array){
//   for(var arr of array){
//     var startIndex1 = arr.indexOf(start);
//     var htmlTag1 = '<td class="tRight " >';
//     var htmlTag2 = '<strong>';
//     var htmlIndex1 = arr.indexOf(htmlTag1,startIndex1);
//     var htmlIndex2 = arr.indexOf(htmlTag2,htmlIndex1);
//     var closeTagIndex1 = arr.indexOf('<span',htmlIndex1);
//     var closeTagIndex2 = arr.indexOf('</strong>',htmlIndex2);
//      var updown = arr.substring(htmlIndex2 + htmlTag2.length,closeTagIndex2);
//      console.log(arr.substring(htmlIndex1 + htmlTag1.length,closeTagIndex1)+updown);
//   }
// }
//
// // 前日比
//
//
// // 出来高(千株)は後で


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
