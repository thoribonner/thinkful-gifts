const productServices = require("./products.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// * validation

async function productExists(req, res, next) {
  const product = await productServices.read(req.params.productId);

  if (product) {
    res.locals.product = product;
    return next();
  }
  next({ status: 404, message: "Product cannot be found." });
}

// * read / GET by id
function read(req, res, next) {
  const { product: data } = res.locals;
  res.json({ data });
}

// * list / GET
async function list(req, res, next) {
  const data = await productServices.list();
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(productExists), read],
  list: [asyncErrorBoundary(list)],
};
