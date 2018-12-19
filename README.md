# Vam-scraping-system
scraping system for my working.[WIP]

# scraping API server

新高値の銘柄名を配列で返す。
```
 GET /stockName   //{"name":["~","~","~"]}
```

新高値銘柄の市場を返す。
```
 GET /marketandkind  //{"market":["~","~","~"],"kind":["~","~","~"]}
```

新高値銘柄の前日の終値を返す。
```
 GET /finalvalue    //{"finalvalue":["~","~","~"]}
```

