/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

//Creating a Schema
const { Schema } = require('mongoose');
const schema = new Schema({ 
  title: {type: String, required: true, select: true},
  comments: {type: Array, default: [], select: true},
  commentcount: {type: Number, default: 0, select: true},
  __v: {type: Number, select: false}
  
})
const Library = mongoose.model('Library', schema);
//------------------

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    Library.find((err,found) => { 
      if(err) return res.send('[]');
      res.json(found);
    }) 
    })
    
    .post(function (req, res){
      let title = req.body.title;
      console.log(req.body);
      if(!title) return res.send('missing required field title');
      let savedBook = new Library({ title: title})
      savedBook.save((err,saved) => { 
        if(err) return;
        res.json({title: saved.title, _id: saved._id});
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      console.log('delete all');
      Library.deleteMany((err,deleted) => { 
        if(err) return;
        console.log(deleted)
        res.send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
     Library.findOne({_id: bookid}, (err,book) => { 
      if(err || !book) return res.send('no book exists');
       res.json({title: book.title, _id: book._id, comments: book.comments})
     }) 
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log('segundo fomulario');
      if(!comment) return res.send('missing required field comment');
      Library.findOne({_id: bookid}, (err,book) => { 
        if(err || !book) return res.send('no book exists');
        let count = book.comments.length;
        let commentUpdated = book.comments.push(comment)
        book.updateOne({$push: {comments: comment}, commentcount: count++},
          (err,updated) => { 
          if(err) return;
          res.json({title: book.title, _id: book._id, comments: book.comments})
        })
      })
    })
      //json res format same as .get
    
    
    .delete(function(req, res){
      console.log('deleted')
      let bookid = req.params.id;
      Library.findOneAndRemove({_id: bookid}, (err,deleted) => { 
        if(err || !deleted) return res.send('no book exists');
        console.log(deleted)
        res.send('delete successful')
      })
      //if successful response will be 'delete successful'
    });
  
};
