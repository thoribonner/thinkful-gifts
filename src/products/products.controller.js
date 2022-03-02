const productServices = require("./products.service");

// * validation

function productExists(req, res, next) {
  productServices
    .read(req.params.productId)
    .then((product) => {
      if (product) {
        res.locals.product = product;
        return next();
      }
      next({ status: 404, message: "Product cannot be found." });
    })
    .catch(next);
}

// * read / GET by id
function read(req, res, next) {
  const { product: data } = res.locals;
  res.json({ data });
}

// * list / GET
function list(req, res, next) {
  productServices
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
  read: [productExists, read],
  list: [list],
};
