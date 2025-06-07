const Invoice = require("../models/Billing/Invoice");
const Payment = require("../models/Billing/Payment");
const Patient = require("../models/UserModels/Patient");

const {
  catchAsync,
  handleNotFound,
  sendResponse,
} = require("../Utils/reusableFunctions");

//Create a new invoice
exports.createInvoice = catchAsync(async (req, res, next) => {
  const { patientId, description, totalAmount, dueDate } = req.body;

  const patient = await Patient.findById({ patientId });
  handleNotFound(patient, "Patient Not Found", next);

  const invoice = await Invoice.create({
    patientId,
    description,
    totalAmount,
    dueDate,
  }).populate("PatientId", "name");

  res.status(200).json({
    status: "success",
    message: "Invoice created successfully",
    invoice,
  });
});

//Get all invoice
exports.getAllInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.find({});
  handleNotFound(invoice, "No Invoice Found", next);

  sendResponse(
    res,
    200,
    "success",
    "All invoice retrieved successfully",
    invoice
  );
});

//Get all invoice for a specific patient
exports.getInvoiceByPatient = catchAsync(async (req, res, next) => {
  const { patientId } = req.params;

  const invoice = await Invoice.findById({ patientId }).populate(
    "patientId",
    "name email"
  );

  handleNotFound(invoice, "Invoice Not Found", next);

  sendResponse(res, 200, "success", "Invoice retrived successfully");
});

// Create a new payment and update invoice status
exports.createPayment = catchAsync(async (req, res, next) => {
  const { patientId, invoiceId, amountPaid, paymentMethod } = req.body;

  //Find invoice
  const invoice = await Invoice.findById(invoiceId);
  handleNotFound(invoice, "Invoice not found", next);

  const newPayment = await Payment.create({
    patientId,
    invoiceId,
    amountPaid,
    paymentMethod,
  });

  // Update the invoice status to "Paid if the amount paid is equal to the total amount"
  amountPaid >= invoice.totalAmount ? (invoice.status = "Paid") : "Pending";
  await invoice.save();

  sendResponse(
    res,
    201,
    "Payment created successfully and invoice status updated",
    newPayment
  );
});

//Get all payment for a specific patient
exports.getPaymentsByPatientsId = catchAsync(async (req, res, next) => {
  const { patientId } = req.params;

  const payment = await Payment.findById({ patientId });
  handleNotFound(payment, " No Payment found for this patient", next);

  sendResponse(res, 200, "success", "Payment retrieved successfully");
});

//Get all payment for a specific Invoice
exports.getPaymentsByInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;

  const payment = Payment.findById({ invoiceId }).populate(
    "patientId",
    "name email"
  );

  handleNotFound(payment, "Payment Not Found");

  sendResponse(res, 200, "success", "Payment retrieved successfully", payment);
});
