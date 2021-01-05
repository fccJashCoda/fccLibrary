/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const Book = require('../models/book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      Book.find()
        .select('title commentcount')
        .then((data) => {
          if (!data) {
            return res.status(500).json({ error: 'server error' });
          }
          return res.json(data);
        })
        .catch((err) => {
          return res.status(500).json({ error: 'server error' });
        });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }

      const book = new Book({
        title,
      });

      book
        .save()
        .then((data) => {
          return res.json({
            _id: data._id,
            title: data.title,
            commentcount: data.commentcount,
          });
        })
        .catch((err) => {
          return res.status(500).json({ error: 'server error' });
        });
    })

    .delete(function (req, res) {
      Book.deleteMany({}, () => {
        res.send('complete delete successful');
      });
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findOne({ _id: bookid })
        .then((book) => {
          if (!book) {
            return res.send('no book exists');
          }

          return res.json(book);
        })
        .catch((err) => {});
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send('missing required field comment');
      }

      Book.findOneAndUpdate(
        { _id: bookid },
        { $push: { comments: comment }, $inc: { commentcount: 1 } },
        { new: true },
        (err, book) => {
          if (err) {
            return res.status(500).json({ error: 'server error' });
          }
          if (!book) {
            return res.send('no book exists');
          }

          return res.json(book);
        }
      );
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.findOneAndDelete({ _id: bookid }, (err, deleted) => {
        if (err) {
          return res.status(500).json({ error: 'server error' });
        }
        if (!deleted) {
          return res.send('no book exists');
        }
        return res.send('delete successful');
      });
    });
};
