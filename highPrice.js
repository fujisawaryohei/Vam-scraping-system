//スクレイピングに必要な情報の定義
var client = require('cheerio-httpcli');
module.exports.url = 'http://www.miller.co.jp/applications/cgi-bin/cv0/rnk20/01/cv0rnk20c.cgi?_hps=off&id=4';
var start = '<td class="tLeft rkgSelected01">';
var arrayBody = new Array;
var htmlBody = new String;
var stockArray = new Array;

//stockArrayは銘柄HTML要素の配列を返す //第2引数では、抽出処理している関数を渡す
exports.stockNameArray = function(link,callback) {
  return new Promise(resolve=>{
    var dom = client.fetch(link);
      dom.then((res)=>{
        var body = res.body;
        var count = (body.match(new RegExp(start,"g"))||[]).length;
          for(var i=1;i <= count;i++) {
            var htmlTag = `<td class="">${i}</td>`;
            var startIndex = body.indexOf(htmlTag);
            var closeIndex = body.indexOf('</tr>',startIndex);
            htmlBody = body.substring(startIndex,closeIndex);
            stockArray.push(htmlBody); //stockArrayが銘柄の配列.
          }
          resolve(callback(stockArray));
      });
  })
}

//新高値銘柄と銘柄コード抽出
exports.extractName = function(array){
  var results = [];
  for(var arr of array){
    var startIndex = arr.indexOf(start);
    var closeTag = arr.indexOf('</a>',startIndex);
    var href = '<a href="/chart.cgi?????TB" target="_chart">';
    var result = arr.substring(start.length + startIndex + href.length, closeTag);
    results.push(result);
  }
   return JSON.stringify({name:results})
  }


//市場と業種の取得
exports.extractMarket = function(array){
  for(var arr of array){
    var startIndex = arr.indexOf(start);
    var htmlTag = '<td class="tLeft ">';
    var htmlIndex = arr.indexOf(htmlTag,startIndex);
    var closeTag = ['<br />','</td>']
    var closeIndex1 = arr.indexOf(closeTag[0],htmlIndex);
    var closeIndex2 = arr.indexOf(closeTag[1],closeIndex1);
    console.log(arr.substring(htmlIndex + htmlTag.length , closeIndex1));     console.log(arr.substring(htmlIndex + htmlTag.length + closeTag[1].length + closeTag[0].length - 1 , closeIndex2));
  }
}

//終値を取得
exports.extractFinalBalance = function(array){
  for(var arr of array){
    var startIndex1 = arr.indexOf(start);
    var htmlTag1 = '<td class="tRight " >';
    var htmlTag2 = '<strong>';
    var htmlIndex1 = arr.indexOf(htmlTag1,startIndex1);
    var htmlIndex2 = arr.indexOf(htmlTag2,htmlIndex1);
    var closeTagIndex1 = arr.indexOf('<span',htmlIndex1);
    var closeTagIndex2 = arr.indexOf('</strong>',htmlIndex2);
     var updown = arr.substring(htmlIndex2 + htmlTag2.length,closeTagIndex2);
     console.log(arr.substring(htmlIndex1 + htmlTag1.length,closeTagIndex1)+updown);
  }
}

// 前日比


// 出来高(千株)は後で
