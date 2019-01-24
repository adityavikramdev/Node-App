const express=require('express');
const router=express.Router();

//bring in Article model
let Article= require('../models/article');
//routes

router.get('/add', function(req,res){
  res.render('add_article',{
    title:'Add articles'
  });
});

//get article
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});
//checking route

router.get('/checking', function(req,res){
  res.render('checking',{
    title:'check'
  });
});

//submit route
router.post('/add', function(req, res){
  req.checkBody('title','Title required').notEmpty();
  req.checkBody('author','Author required').notEmpty();
  req.checkBody('body','Body required').notEmpty();
  //errors
  let errors=req.validationErrors();

  if(errors){
    res.render('add_article',{
      title:'Add article',
      errors:errors
    });
  }
  else{
    let article =new Article();
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Article added to the list');
        res.redirect('/');
      }
    });
  }

});

//Edit article
router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

//submit route
router.post('/edit/:id', function(req, res){
  let article ={};
  article.title=req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;
  let query={_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('success','Article Updated');
      res.redirect('/');
    }
  })
  return;
});

//Deleting
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    else{
      req.flash('danger', 'article deleted');
      res.send('Success');
    }
  });
});

module.exports =router;
