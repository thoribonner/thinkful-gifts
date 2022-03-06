const productsService = require("./products.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// * validation

// * verify product id exists
async function productExists(req, res, next) {
  const product = await productsService.read(req.params.productId);

  if (product) {
    res.locals.product = product;
    return next();
  }
  next({ status: 404, message: "Product cannot be found." });
}
// * end validation

// * read / GET by id
function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

// * list / GET
async function list(req, res) {
  const data = await productsService.list();
  res.json({ data });
}

// * count out of stock products
async function listOutOfStockCount(req, res) {
  res.json({ data: await productsService.listOutOfStockCount() });
}

// * price summary by supplier
async function listPriceSummary(req, res) {
  res.json({ data: await productsService.listPriceSummary() });
}

// * total weight by product
async function listTotalWeightByProduct(req, res) {
  res.json({ data: await productsService.listTotalWeightByProduct() });
}

module.exports = {
  read: [asyncErrorBoundary(productExists), read],
  list: [asyncErrorBoundary(list)],
  listOutOfStockCount: asyncErrorBoundary(listOutOfStockCount),
  listPriceSummary: asyncErrorBoundary(listPriceSummary),
  listTotalWeightByProduct: asyncErrorBoundary(listTotalWeightByProduct),
};
