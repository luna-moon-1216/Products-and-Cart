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

  getStyles: function(param, callback) {
    const id = Number(param.product_id);
    const styles = {
      product_id: id,
      results: [],
    };
    const queryString = `SELECT id AS style_id, name, original_price, sale_price, default_style AS "defautl?" FROM styles WHERE productId = ${id}`;
    db.query(queryString)
      .then((data) => {
        styles.results = data.rows;
        return styles.results;
      })
      .then((styles) => {
        const stylesPromise = [];
        styles.forEach((style) => {
          const styleId = style.style_id;
          const queryAddition = `SELECT array_agg(thumbnail_url) AS thumbnail_url, array_agg(url) AS url, skus.id AS skusId,
          jsonb_object_agg(size, quantity) AS skus
          FROM photos
          INNER JOIN skus ON photos.styleId= skus.styleId
          WHERE photos.styleId = ${styleId}
          GROUP BY skusId`;
          const additions = db.query(queryAddition).then((data) => { return data.rows});
          stylesPromise.push(additions);
        })
        return Promise.all(stylesPromise);
      })
      .then((data) => {
        // console.log(data.length, 'addtion')
        // console.log(styles.results.length, 'styles')
        for(var i = 0; i < styles.results.length; i ++) {
          const style = styles.results[i];
          const additions = data[i];
          const photos = [];
          const skus = {};
          for(var j = 0; j < additions[0].thumbnail_url.length; j++) {
            const photo = {
              thumbnail_url: additions[0].thumbnail_url[j],
              url: additions[0].url[j]
            };
            photos.push(photo);
          }
          style.photos = photos;
          for(var k = 0; k < additions.length; k++) {
            skus[additions[k].skusid] = {
              quantity: Object.values(additions[k].skus)[0],
              size: Object.keys(additions[k].skus)[0]
            }
          }
          style.skus = skus;
        }
        // console.log(styles);
        callback(null, styles);
      })
      .catch((err) => {
        callback(err, null);
      })
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


