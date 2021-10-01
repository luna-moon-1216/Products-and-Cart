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
    const params = [id];
    const styles = {
      product_id: id,
      results: [],
    };
    const queryString = `SELECT id AS style_id, name, original_price, sale_price, default_style AS "defautl?" FROM styles WHERE productId = $1`;
    db.query(queryString, params)
      .then((data) => {
        //will return the intial styles query result + photos + skus
        return Promise.all(
          //map will return an array, each element represent an individual style
          //Promise all take an array as input
          data.rows.map((style) => {
            const styleId = style.style_id;
            const queryPhoto = `SELECT thumbnail_url, url FROM photos WHERE styleId=${styleId}`;
            //query photos for each style
            const photos = db
              .query(queryPhoto)
              .then((photos) => {
                return photos.rows;
              })
              .catch((error) => {
                console.log(`There is an error related to ${styleId}`);
                callback(error, null);
              });
            //query skus for each style
            const querySkus = `SELECT id, quantity, size FROM skus WHERE styleId=${styleId}`;
            const skus = db.query(querySkus).then((skus) => {
              // console.log(skus.rows);
              //create an object to format the data, this object is the skus property in each style
              const skusResult = {};
              for (let sku of skus.rows) {
                const stock = {
                  size: sku.size,
                  quantity: sku.quantity,
                };
                skusResult[sku.id] = stock;
              }
              return skusResult;
            });
            // the return value for the map function, which is individual style
            return Promise.all([photos, skus])
              .then((result) => {
                style.photos = result[0];
                style.skus = result[1];
                return style;
              })
              .catch((error) => {
                console.log(error);
                callback(error, null);
              });
          })
        );
      })
      .then((data) => {
        //this data represent the fully formatted style data, send it back to the controller
        styles.results = data;
        callback(null, styles);
      });
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
        console.log(res.rows[0].array);
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


