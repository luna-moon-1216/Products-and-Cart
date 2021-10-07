DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
 	name varchar(255),
 	slogan text,
 	description text,
 	category varchar(255),
 	default_price int
);

DROP TABLE IF EXISTS features;

CREATE TABLE features (
	id SERIAL PRIMARY KEY,
	product_id int,
	feature varchar(255),
	value varchar(255),
  CONSTRAINT fk_products
    FOREIGN KEY(product_id)
	    REFERENCES products(id)
			ON DELETE CASCADE
);

DROP TABLE IF EXISTS related;

CREATE TABLE related (
	id SERIAL PRIMARY KEY,
	current_product_id int,
	related_product_id int
);

DROP TABLE IF EXISTS styles CASCADE;

CREATE TABLE styles (
	id SERIAL PRIMARY KEY,
	productId int,
	name varchar(255),
	sale_price int,
	original_price int,
	default_style bool,
	CONSTRAINT fk_products
    FOREIGN KEY(productId)
	    REFERENCES products(id)
			ON DELETE CASCADE
);

DROP TABLE IF EXISTS skus;

CREATE TABLE skus (
	id SERIAL PRIMARY KEY,
	styleId int,
	size varchar(255),
	quantity int,
	CONSTRAINT fk_styles
    FOREIGN KEY(styleId)
	    REFERENCES styles(id)
			ON DELETE CASCADE
);

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
	id SERIAL PRIMARY KEY,
	styleId int,
	url text,
	thumbnail_url text,
	CONSTRAINT fk_styles
    FOREIGN KEY(styleId)
	    REFERENCES styles(id)
			ON DELETE CASCADE
);

DROP TABLE IF EXISTS cart CASCADE;

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_session int,
  product_id int,
  active bool
);

DROP TABLE IF EXISTS cart_skus;

CREATE TABLE cart_skus (
  id SERIAL PRIMARY KEY,
  sku_id int,
  count int,
  user_session int
);

\copy products FROM '/Users/luna/Downloads/product.csv' DELIMITER ',' csv header;
\copy styles FROM '/Users/luna/Downloads/styles.csv' DELIMITER ',' null as 'null' csv header;
\copy features FROM '/Users/luna/Downloads/features.csv' DELIMITER ',' csv header;
\copy related FROM '/Users/luna/Downloads/related.csv' DELIMITER ',' csv header;
\copy photos FROM '/Users/luna/Downloads/photos.csv' DELIMITER ',' csv header;
\copy skus FROM '/Users/luna/Downloads/skus.csv' DELIMITER ',' csv header;
\copy cart FROM '/Users/luna/Downloads/cart.csv' DELIMITER ',' csv header;


