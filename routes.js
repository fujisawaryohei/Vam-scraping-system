var express = require("express");
var router = express.Router();

router.get('/',(req,res,next)=>{
  res.send("これは新高値銘柄の情報を返すJSON APIです。");
});
//オブジェクトをエクスポートする。
module.exports = router;
