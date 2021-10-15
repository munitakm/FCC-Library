/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
chai.use(chaiHttp);

suite('Functional Tests', function() {

  
  let testId;
  let title = 'CASA';
  let comment = 'comment test';
  suite('Routing tests', function() {
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books/')
        .send({title: title})
        .end((err,res) => {
          testId = res.body._id;
          assert.equal(res.status,  200);
          assert.isObject(res.body, 'response should be an object');
          done()
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books/')
        .send({title: ''})
        .end((err,res) => { 
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'missing required field title');
          done()
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books/')
        .end((err, res) => { 
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/123456789')
        .end((err,res) => { 
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + testId)
        .end((err,res) => { 
          assert.equal(res.status, 200);
          assert.equal(res.body.title, title)
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + testId)
        .send({comment: comment})
        .end((err,res) => { 
          assert.equal(res.status, 200),
          assert.equal(res.body.comments, comment);
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/' + testId)
        .send({comment: ''})
        .end((err,res) => { 
          assert.equal(res.status, 200);
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/1234567890')
        .send({comment: comment})
        .end((err,res) => { 
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('api/books/' + testId)
        .end(function(err,res) { 
          try {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          } catch(err) {
            console.log(err);
            done()
          }
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('api/books/123456789')
        .end(function(err,res) { 
          try {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
          }
          catch(err) {
          console.log(err);
          done()
          }
        })
      });
    });
  });
});
