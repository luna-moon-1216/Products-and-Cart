const request = require('supertest');
const app = require('../index.js');
const { Pool } = require('pg');
const { dbConfig } = require('../database/products/config.js');
const db = require('../database/products/index.js');

afterAll((done) => {
  db.end();
  done();
});

describe("/get/products", () => {
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

describe("/get/products/:product_id", () => {
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

describe("/get/products/:product_id/styles", () => {
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


xdescribe("get /cart", () => {

  test("request with valid product id", () => {
    return request(app).get("/catwalk/cart").then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
    });
  });
});


