var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// initialize models
require('../models/models.js');
var Post = mongoose.model('Post');

router.route('/posts')
  //return all posts
  .get(function(req,res){
    
    //TODO return all posts
    Post.find(function(err,docs){
      if(err)
      {
         return res.send(500, {message: err});
      }
      else
      {
        return res.send(docs);
      }
    });
  })

// create a new post
  .post(function(req,res){
        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.save(function(err,post){
          if(err)
            return res.send(500,err);
          else
            return res.json(post);
        });
  });

router.route('/posts/:id')
  // returns a particular post
  .get(function(req,res){
    // return post with ID
    Post.findById(req.params.id, function(err,post){
      if(err)
        return res.send(500,err);
      else
        return res.json(post);
    });
  })

  .put(function(req,res){
    //TODO modify post with ID 
   Post.findById(req.params.id, function(err,post){
      if(err)
        return res.send(500,err);
      else
        {
          post.created_by = req.body.created_by;
          post.text = req.body.text;
          post.save(function(err,post){
            if(err)
              res.send(500,err);
            else
              res.json(post);
          });
        }
    });
  })

  .delete(function(req,res){
    // TODO delete post with ID 
    Post.remove({_id:req.params.id},function(err,post){
      if(err)
        return res.send(500,err);
      else
        return res.json("Deleted :( ");
    });
  });
module.exports = router;
