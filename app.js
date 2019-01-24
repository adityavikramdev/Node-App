const express= require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');

mongoose.connect('mongodb://localhost/nodekb');
let db= mongoose.connection;
//checking connection
db.once('open',function(){
  console.log('Connected to mongodb');
});
//check errors in db
db.on('error',function(err){
  console.log(err);
});
//initilaize app
const app=express();
//bring in models
let Article=require('./models/article');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//body parser middleware
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

//set public static
app.use(express.static(path.join(__dirname, 'public')));
//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam=root;

    while(namespace.length){
      formParam += '[' +namespace.shift() +']';
    }
    return {
      param :formParam,
      msg:msg,
      value:value

    };
  }
}));
//Home route

app.get('/', function(req,res){
Article.find({},function(err,articles){
  if(err){
    console.log(err);
  }
  else{
    res.render('index',{
      title:'Hello node js',
      articles:articles
    });
  }
 });
});

//route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


app.listen(3000, function(){
  console.log('server started successfully on port 3000..')
});
