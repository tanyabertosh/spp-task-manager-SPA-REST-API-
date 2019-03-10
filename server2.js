var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path');
var app = express();
app.use(express.static(__dirname + '/public'));

const taskRoutes=require('./api/routes/tasks');
app.use('/tasks',taskRoutes);

var somedata = JSON.parse(fs.readFileSync('file.json', 'utf8'));
const port = process.env.PORT || 3000

// устанавливаем движок EJS для представления
app.set('views','./views');
app.set('view engine','ejs');
 
app.get('/download/:file',(req, res) => {
  var fileName = req.params.file;
  var fileLocation = __dirname + "/uploads/"+fileName;
  var file = fs.readFileSync(fileLocation,'utf8');
  res.sendFile(fileLocation);
});


app.get('/data', function(req, res) {
  res.send(somedata);
  
});

app.get('/', function(req, res) {
  res.render('pages/index');
  
});


app.post("/", function (request, response) {
  
});


app.listen(3000);
console.log('Приложение запущено! Смотрите на http://localhost:3000');