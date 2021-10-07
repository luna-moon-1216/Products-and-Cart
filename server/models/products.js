const db = require('../database/products/index.js');

module.exports = {
  getAll: function (param, callback) {
    const page = param.page || 1;
    const count = param.count || 5;
    const limit = Number(page * count);
    const queryString = `SELECT * FROM products LIMIT ${limit}`;
    db.query(queryString, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },

  getOne: function (param, callback) {
    const id = Number(param.product_id);
    const queryString = `SELECT products.id, products.name, products.description, products.category, products.default_price, array_agg(features.feature) AS feature, array_agg(features.value) AS value
    FROM products
    INNER JOIN features ON products.id = features.product_id
    WHERE products.id=${id}
    GROUP BY products.id, products.name, products.description, products.category, products.default_price`;

    db.query(queryString)
      .then((data) => {
        var product = data.rows[0];
        var features = [];
        for (let i = 0; i < product.feature.length; i++) {
          const feature = {
            feature: product.feature[i],
            value: product.value[i],
          };
          features.push(feature);
        }
        delete product.feature;
        delete product.value;
        product.features = features;
        callback(null, product);
      })
      .catch((err) => {
        callback(err, null);
      });
  },

  getStyles: function (param, callback) {
    const id = Number(param.product_id);
    const styles = {
      product_id: id,
      results: [],
    };
    const queryString = `SELECT id AS style_id, name, original_price, sale_price, default_style AS "defautl?",
                         (SELECT array_agg(json_build_object('thumbnail_url', photos.thumbnail_url, 'url', photos.url)) AS photos FROM photos WHERE photos.styleId = styles.id),
                         (SELECT json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size)) AS skus FROM skus WHERE skus.styleId = styles.id)
                         FROM styles
                         WHERE styles.productId =${id}`;
    db.query(queryString).then((data) => {
      styles.results = data.rows;
      return styles;
    })
    .then((styles) => callback(null, styles))
    .catch((err) => callback(err, null));
  },


  getRelated: function (param, callback) {
    const id = Number(param.product_id);
    const params = [id];
    const queryString =
      "SELECT ARRAY (SELECT related_product_id FROM related WHERE current_product_id = $1)";
    db.query(queryString, params, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        // console.log(res.rows[0].array);
        callback(null, res.rows[0].array);
      }
    });
  },

  postCart: function (param, callback) {
    db.query("SELECT MAX(id) FROM cart").then((result) => {
      const id = result.rows[0].max;
      const queryString =
        "INSERT INTO cart (id, user_session, product_id, active) VALUES ($1, $2, $3, $4)";
      const params = [
        id + 1,
        Number(param.session),
        Number(param.content.product_id),
        1,
      ];
      db.query(queryString, params)
        .then((data) => {
          const queryCartSkus =
            "INSERT INTO cart_skus (sku_id, count, user_session) VALUES ($1, $2, $3)";
          const paramSkus = [
            Number(param.content.sku_id),
            Number(param.content.count),
            Number(param.session),
          ];
          return db.query(queryCartSkus, paramSkus);
        })
        .then((data) => {
          callback(null, data);
        })
        .catch((err) => {
          callback(err, null);
        });
    });
  },

  getCart: function (param, callback) {
    const queryString =
      "SELECT sku_id, count FROM cart_skus WHERE user_session=$1";
    const params = [Number(param)];
    db.query(queryString, params)
      .then((data) => {
        callback(null, data.rows);
      })
      .catch((err) => {
        callback(err, null);
      });
  },

};


