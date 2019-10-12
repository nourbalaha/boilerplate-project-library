/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
require("dotenv").config();

var mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

var Book = require("../Book");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to db");
});

module.exports = function (app) {

  app.route('/api/books/')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          Book.find().then(results=>{
            const result = results.map(data=>{
              return({
                _id: data._id,
                title: data.title,
                commentcount: data.comments.length
              })
            })
            res.json(result);
          }).catch(err=>console.log(err));
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      const title = req.body.title;
      if(title==""){
        res.send("no title added")
      } else {
        const book = new Book({title});
        book.save().then(data=>{
          res.json(data);
        }).catch(err=>console.error(err))
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}).then(()=>{
        res.send("complete delete successful")
      })
      .catch(err=>console.error(err));
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        Book.findById(bookid)
        .then(data=>{
          if(data!==null){
            res.json(data);
          } else {
            res.send('no book exists');
          }
        })
        .catch(err=>console.error(err));
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(bookid,{$push:{comments:comment}},{useFindAndModify:false, new:true})
      .then(data=>{
        res.json(data);
      })
      .catch(err=>console.error(err));
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid).then(()=>{
        res.send("delete successful")
      })
      .catch(err=>console.error(err));
    });
  
};
