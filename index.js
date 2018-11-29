const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
//このスコープを変更する場合は、token.jsonを削除する。
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
//token.jsonにはユーザーのアクセストークンとリフレッシュトークンが格納される。

//最初の認証フローが完了したら自動的に作成される。
const TOKEN_PATH = 'token.json';
//ローカルファイルからクライアントシークレットをロードする。
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // credentials.jsonでGoogle sheets APIを呼び出すクライアント認証を行う。
  authorize(JSON.parse(content), getData);
});

//指定された資格情報を使用してOauth2クライアントを作成し、
 //* @param {Object} 認証クライアントの資格情報。
 //* @param {function} 許可されたクライアントとコールバック関数。

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

//ユーザー認証のアウトプット後に新しいトークンを取得して保存する。
//許可されたOauth2クライアントで指定のコールバックを実行する。
// @params {google.auth.OAuth2}
// @params {getEventsCallback}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


const sheetId = '1mVsqgJCIQJYbdajxG2m7O4nW-5Zz0nghx7SxKm-ssq0'


function getData(auth,sheetId) {
  const sheets = google.sheets({version: 'v4', auth})
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'C20:B40',
  }, (err, res) => {
    if (err) return console.log('APIが以下の理由でエラー:' + err);
    const rows = res.data.values;
    console.log(rows);
    if (rows.length) {
      console.log('success!');
    } else {
      console.log('No data found.');
    }
  });
}

function dataAppend(auth,sheetId,arr){
  let values = arr;
  let valuesHash = {values};
  sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range:'C20:B40',
    resources:valueHash
  },(err,res)=>{
    if(err){
       return console.log('APIが以下の理由でエラー:' + err);
    } else {
      console.log(`${res.updates.updatedCells}を追加しました。`);
    }
  });
}
