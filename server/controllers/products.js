const models = require('../models');

module.exports = {
  getAll: function (req, res) {
    console.log(req.query)
    const param = req.query;
    models.products.getAll(param, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  },

  getOne: function (req, res) {
    // console.log(req.params);
    const param = req.params;
    models.products.getOne(param, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  },

  getStyles: function (req, res) {
    const param = req.params;
    models.products.getStyles(param, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  },

  getRelated: function (req, res) {
    // console.log(req.params);
    const param = req.params;
    models.products.getRelated(param, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  },

  getCart: function (req, res) {
    // console.log(req.headers);
    const param = req.headers.user_session;
    models.products.getCart(param, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  },

  postCart: function (req, res) {
    // console.log("body", req.body);
    // console.log("user_session", req.headers.user_session);
    const param = {
      session: req.headers.user_session,
      content: req.body,
    };
    models.products.postCart(param, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(param);
      }
    });
  },
};