const request = require('supertest');
const app = require('../index.js');
const db = require('../database/products/index.js');

afterAll((done) => {
  db.end();
  done();
});

describe("get /products", () => {
  test("requested without query parameters of page and count", () => {
    return request(app)
      .get("/catwalk/products")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(5);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[1]).toHaveProperty("name");
        expect(response.body[2]).toHaveProperty("description");
        expect(response.body[3]).toHaveProperty("category");
        expect(response.body[4]).toHaveProperty("default_price");
      });
  });

  test("requested with query parameters of page and count", () => {
    return request(app)
      .get("/catwalk/products/?page=1&count=8")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(8);
      });
  });
});

describe("get /products/:product_id", () => {
  test("requested without product id", () => {
    return request(app).get("/catwalk/products/:").then((response) => {
      expect(response.statusCode).toBe(400);
    });
  });

  test("request with valid product id", () => {
    return request(app).get("/catwalk/products/1").then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("features");
    });
  });
});

describe("get /products/:product_id/styles", () => {
  test("requested without product id", () => {
    return request(app).get("/catwalk/products/:/styles").then((response) => {
      expect(response.statusCode).toBe(400);
    });
  });

  test("request with valid product id", () => {
    return request(app).get("/catwalk/products/1/styles").then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty("product_id");
      expect(response.body).toHaveProperty("results");
      expect(response.body.results.length).toBe(6);
    });
  });
});

describe("get /products/:product_id/related", () => {
  test("requested without product id", () => {
    return request(app)
      .get("/catwalk/products/:product_id/related")
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("request with valid product id", () => {
    const expected = [2, 3, 8, 7]
    return request(app)
      .get("/catwalk/products/1/related")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expected);
      });
  });
});

describe("get /cart", () => {
  test("request without user session", () => {
    return request(app).get("/catwalk/cart").then((response) => {
      expect(response.statusCode).toBe(400);
      expect(response.body.name).toEqual("error");
    });
  });

  test("request with valid user session", () => {
    return request(app).get("/catwalk/cart").set("user_session", 1234).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
    });
  });
});

describe("post /cart", () => {
  describe("cannot post without valid selection", () => {
    test("cannot post without valid product id", () => {
      const product = {
        sku_id: "1281032",
        count: "5",
      };
      return request(app)
        .post("/catwalk/cart")
        .set("user_session", 1234)
        .send(product)
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    test("cannot post without valid sku id", () => {
      const product = {
        "product_id": "5",
        "count": "5"
      };
      return request(app)
        .post("/catwalk/cart")
        .set("user_session", 1234)
        .send(product)
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    test("cannot post without user session", () => {
      const product = {
        "product_id": "5",
        "sku_id": "1281032",
        "count": "5"
      };
      return request(app)
        .post("/catwalk/cart")
        .send(product)
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });
  });

  describe("can successfully post to the database with valid information", () => {
    test("test post request with user_session, product_id, sku_id and count", () => {
      const product = {
        product_id: "5",
        sku_id: "1281032",
        count: "5",
      };
      return request(app)
        .post("/catwalk/cart")
        .set("user_session", 8888)
        .send(product)
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });

    afterEach((done) => {
      db.query("DELETE FROM cart WHERE user_session=8888")
        .then(() => {
          return db.query("DELETE FROM cart_skus WHERE user_session=8888");
        })
        .then(() => done())
        .catch((err) => done(err));
    });
  });
});


