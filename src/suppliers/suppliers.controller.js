const suppliersService = require("./suppliers.service.js");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// * validation

// * existing columns in table
const VALID_PROPERTIES = [
  "supplier_name",
  "supplier_address_line_1",
  "supplier_address_line_2",
  "supplier_city",
  "supplier_state",
  "supplier_zip",
  "supplier_phone",
  "supplier_email",
  "supplier_notes",
  "supplier_type_of_goods",
];

// * verify only existing properties provided
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}
// * verify required fields present
const hasRequiredProperties = hasProperties("supplier_name", "supplier_email");

// * verify supplier id exists
// * ensures supplier id not overwritten
async function supplierExists(req, res, next) {
  const supplier = await suppliersService.read(req.params.supplierId);
  if (supplier) {
    res.locals.supplier = supplier;
    return next();
  }
  next({ status: 404, message: `Supplier cannot be found.` });
}
// * end validation

// * create / POST
async function create(req, res) {
  const data = await suppliersService.create(req.body.data);
  res.status(201).json({ data });
}

// * update existing supplier
async function update(req, res) {
  const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id,
  };
  const data = await suppliersService.update(updatedSupplier);
  res.json({ data });
}

async function destroy(req, res) {
  await suppliersService.delete(res.locals.supplier.supplier_id);
  res.sendStatus(204);
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(supplierExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(supplierExists),
    asyncErrorBoundary(destroy)
  ],
};
