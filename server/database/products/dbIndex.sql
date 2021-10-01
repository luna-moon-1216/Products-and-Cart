CREATE INDEX idx_id
   ON products(id);


CREATE INDEX idx_feature_productId
   ON features(product_id);


CREATE INDEX idx_styles
   ON styles(id, productId);


CREATE INDEX idx_skus_styleId
   ON skus(styleId);

CREATE INDEX idx_photos_styleId
   ON photos(styleId);
