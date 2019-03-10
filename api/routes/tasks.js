const express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
const router = express.Router();

  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname)
    }
  });
  
  const upload = multer({storage: storage});
  
  function readJsonFileSync(){
    var somedata = fs.readFileSync('file.json', 'utf8')
  
    return JSON.parse(somedata)
  }

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

router.get('/',(req,res,next)=>{

});

router.post("/create", upload.single('myfile'), urlencodedParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  console.log(request.body);
  obj=JSON.parse(fs.readFileSync('file.json', 'utf8'));

  var fName=""; var fType="";
  if (typeof request.file !== 'undefined') {
    fName =request.file.originalname;
    fType=request.file.mimetype;
  }
  obj.categories.push({taskName: `${request.body.taskName}`, deadline:`${request.body.deadline}`,
  status:`${request.body.status}`, fileName: fName, fileType: fType});

  var json = JSON.stringify(obj); //convert it back to json
  console.log(json);
  fs.writeFile('file.json', json, 'utf8', (error)=>{
    console.log(error);
  });
  response.send(json);
});

router.delete("/delete/:task", urlencodedParser, function (request, response) {
  if(!request.params) return response.sendStatus(400);
  var obj=JSON.parse(fs.readFileSync('file.json', 'utf8'));
  for (var i=0 ; i < obj.categories.length ; i++)
  {
      if (obj.categories[i].taskName == `${request.params.task}`) {
        obj.categories.splice(i, 1);
        break;
      }
  }
  var json = JSON.stringify(obj); //convert it back to json
  console.log(json);
  fs.writeFile('file.json', json, 'utf8', (error)=>{
    console.log(error);
  });
  response.send(json);
});

router.put("/update", upload.single('myfile'), urlencodedParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  console.log(request.body);
  obj=JSON.parse(fs.readFileSync('file.json', 'utf8'));
  var fName=""; var fType="";
  updateObj(obj,request);
  var json = JSON.stringify(obj); //convert it back to json
  console.log(json);
  fs.writeFile('file.json', json, 'utf8', (error)=>{
    console.log(error);
  });
  response.send(json);
});

function updateObj(obj,request){
    var bool=false;
    for (var i=0 ; i < obj.categories.length ; i++)
    {
      if (obj.categories[i].taskName == `${request.body.taskName}`) {
        bool=true;
        obj.categories[i].deadline=`${request.body.deadline}`;
        obj.categories[i].status=`${request.body.status}`;
        if (typeof request.file !== 'undefined') {
          obj.categories[i].fileName = request.file.originalname;
          obj.categories[i].fileType = request.file.mimetype;
        }
        break;
      }
    }
    return bool;
  }

module.exports=router;