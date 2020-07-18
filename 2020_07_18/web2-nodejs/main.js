var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
    </html>`;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  // if(_url == '/'){
  //   title = 'Welcome';
  // }
  // if(_url == '/favicon.ico'){
  //   return response.writeHead(404);
  // }

  if (pathname === "/") {
    if (queryData.id === undefined) {

      fs.readdir('./data', function(error, filelist) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
      })


    } else {
      fs.readdir('./data', function(error, filelist) {
        fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          // 아래 부분이 내가 가지고 있는 파일들을 불러주는 것이었음.
          // response.end(fs.readFileSync(__dirname + _url));
          response.writeHead(200); // 200이라는 숫자는 서버와 브라우저가 서로 ㅇㅋ 하고 주고 받는 약속의 숫자.
          response.end(template);
        });
      });
    }

  } else {
    response.writeHead(404); // 못찾겠다. 당연 404
    response.end("Not Found");
  }


});
app.listen(3000);

// http://localhost/?id=HTML 라는 URL이 있다면,
// ? 이후에 나오는 부분들을 Query String 이라고 한다.
