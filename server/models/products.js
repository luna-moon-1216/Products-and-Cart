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

  // getStyles: function (param, callback) {
  //   const id = Number(param.product_id);
  //   const styles = {
  //     product_id: id,
  //     results: [],
  //   };
  //   const queryString = `SELECT id AS style_id, name, original_price, sale_price, default_style AS "defautl?" FROM styles WHERE productId = ${id}`;
  //   const styleInfo = db.query(queryString);
  //   const queryAddition = `SELECT photos.styleId, array_agg(thumbnail_url) AS thumbnail_url, array_agg(url) AS url, skus.id AS skusId, jsonb_object_agg(size, quantity) AS skus
  //   FROM photos
  //   INNER JOIN skus ON photos.styleId= skus.styleId
  //   WHERE photos.styleId IN (SELECT id FROM styles WHERE productId = ${id})
  //   GROUP BY photos.styleId, skusId`;
  //   const additions = db.query(queryAddition);

  //   return Promise.all([styleInfo, additions]).then((data) => {
  //     const styleResult = data[0].rows;
  //     const addtionResult = data[1].rows;
  //     for(let i = 0; i < styleResult.length; i++) {
  //       const photos = [];
  //       const skus = {};
  //       let check = 0;
  //       for(let j = 0; j < addtionResult.length; j++) {
  //         if(addtionResult[j].styleid === styleResult[i].style_id) {
  //           check ++;
  //           skus[addtionResult[j].skusid] = {
  //             quantity: Object.values(addtionResult[j].skus)[0],
  //             size: Object.keys(addtionResult[j].skus)[0]
  //           }
  //           if(check === 1) {
  //             for(let x = 0; x < addtionResult[j].thumbnail_url.length; x++) {
  //               const photo = {
  //                 thumbnail_url: addtionResult[j].thumbnail_url[x],
  //                 url: addtionResult[j].url[x]
  //               }
  //               photos.push(photo);
  //             }
  //           }
  //         } else {
  //           check = 0;
  //         }
  //       };
  //       styleResult[i].photos = photos;
  //       styleResult[i].skus = skus;
  //       styles.results = styleResult;
  //     }
  //     return styles;
  //   })
  //   .then((styles) => {
  //     callback(null, styles);
  //   })
  //   .catch((err) => callback(err, null));
  // },

  getStyles: function (param, callback) {
    const id = Number(param.product_id);
    const styles = {
      product_id: id,
      results: [],
    };
    const queryStyle = `SELECT id AS style_id, name, original_price, sale_price, default_style AS "defautl?" FROM styles WHERE productId = ${id}`;
    const queryPhoto = `SELECT styleId, thumbnail_url, url FROM photos WHERE styleId IN (SELECT id FROM styles WHERE productId = ${id})`;
    const querySkus = `SELECT * FROM skus WHERE styleId IN (SELECT id FROM styles WHERE productId = ${id})`;
    const styleInfo = db.query(queryStyle);
    const photoInfo = db.query(queryPhoto);
    const skusInfo = db.query(querySkus);

    return Promise.all([styleInfo, photoInfo, skusInfo]).then((data) => {
      const styleCollection = data[0].rows;
      const photoCollection = data[1].rows;
      const skusCollection = data[2].rows;
      for(let i = 0; i < styleCollection.length; i++) {
        const photos = [];
        const skus = {};
        for(let j = 0; j < photoCollection.length; j++) {
          if(styleCollection[i].style_id === photoCollection[j].styleid) {
            delete photoCollection[j].styleid;
            photos.push(photoCollection[j]);
          }
        }

        for(let k = 0; k < skusCollection.length; k++) {
          if(styleCollection[i].style_id === skusCollection[k].styleid) {
            skus[skusCollection[k].id] = {
              quantity: skusCollection[k].quantity,
              size: skusCollection[k].size
            }
          }
        }
        styleCollection[i].photos = photos;
        styleCollection[i].skus = skus;
        styles.results.push(styleCollection[i]);
      }
      return styles;
    })
    .then((styles) => {
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


