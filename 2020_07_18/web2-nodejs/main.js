var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
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
      ${control}
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
        var template = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });


    } else {
      fs.readdir('./data', function(error, filelist) {
        fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            ` <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
              `);
          // 아래 부분이 내가 가지고 있는 파일들을 불러주는 것이었음.
          // response.end(fs.readFileSync(__dirname + _url));
          response.writeHead(200); // 200이라는 숫자는 서버와 브라우저가 서로 ㅇㅋ 하고 주고 받는 약속의 숫자.
          response.end(template);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function(error, filelist) {
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="/create_process" method="post">

        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>

        </form>
        `, '');
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {
          Location: `/?id=${title}`
        }); // 200은 연결성공, 302는 redirect임. 그리고 Location 뒤쪽의 주소로 보내주겠다 임.
        response.end();
      });
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function(error, filelist) {
      fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, description) {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list,
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>

          </form>

          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {
            Location: `/?id=${title}`
          });
          response.end();
        });
      });
    });
  }else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(error){
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      })
    });
  } else {
    response.writeHead(404); // 못찾겠다. 당연 404
    response.end("Not Found");
  }


});
app.listen(3000);

// http://localhost/?id=HTML 라는 URL이 있다면,
// ? 이후에 나오는 부분들을 Query String 이라고 한다.
