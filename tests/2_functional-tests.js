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

chai.use(chaiHttp);

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    // storing the test comment id
    let id;

    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          const book = {
            title: 'Moby Dick',
          };

          chai
            .request(server)
            .post('/api/books')
            .send(book)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, '_id', 'Response should contain an id');
              assert.property(
                res.body,
                'commentcount',
                'Response should contain a commentcount'
              );
              assert.property(
                res.body,
                'title',
                'Response should contain a title'
              );
              assert.equal(
                res.body.commentcount,
                0,
                'commentcount should be 0 for a new post'
              );
              assert.equal(
                res.body.title,
                'Moby dick',
                'the title of the book should be the same as the requested book'
              );
              id = req.body._id;
            });
          done();
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.body, 'response should be a string');
              assert.equal(
                res.body,
                'missing required field title',
                'should return missing required field title'
              );
            });
          done();
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain a title'
            );
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
          });
        done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/5ff49ed9ea32b206c8eecccc')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(
              res.body,
              'no book exists',
              'response should be "no book exists"'
            );
          });
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(
              res.body,
              'commentcount',
              'response should contain the books commentcount'
            );
            assert.property(
              res.body,
              'title',
              'response should contain the books title'
            );
            assert.property(
              res.body,
              '_id',
              'response should contain the books _id'
            );
          });
        done();
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          const comment = {
            comment: 'Hello there',
          };
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send(comment)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(
                res.body,
                'commentcount',
                'response should contain the books commentcount'
              );
              assert.property(
                res.body,
                'title',
                'response should contain the books title'
              );
              assert.property(
                res.body,
                '_id',
                'response should contain the books _id'
              );
              assert.equal(
                res.body.comments.length,
                res.body.commentcount,
                'commentcound is the same as the comments array length'
              );
              assert.equal(
                res.body.comments[0],
                'Hello there',
                'the first comment in the comments array is identical to the one sent'
              );
            });
          done();
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.body, 'the response is a string');
              assert.equal(
                res.body,
                'missing required field comment',
                'returns the correct error message'
              );
            });
          done();
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          const comment = {
            comment: 'Hello there',
          };
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send(comment)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isString(res.body, 'the response is a string');
              assert.equal(
                res.body,
                'no book exists',
                'returns the correct error message'
              );
            });
          done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .post(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'the response is a string');
            assert.equal(
              res.body,
              'delete successful',
              'returns the correct success message'
            );
          });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'the response is a string');
            assert.equal(
              res.body,
              'no book exists',
              'returns the correct error message'
            );
          });
        done();
      });
    });
  });
});
