
const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  id: String,
  slNo: Number,
  description: String,
  hsnSac: String,
  quantity: Number,
  rateIncTax: Number,
  ratePerItem: Number,
  amount: Number,
  cylinderId: { type: String, required: false }
});

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  irn: String,
  ackNo: String,
  ackDate: String,
  
  // Seller information
  sellerName: String,
  sellerAddress: String,
  sellerGstin: String,
  sellerContact: String,
  sellerEmail: String,
  sellerState: String,
  sellerStateCode: String,
  
  // Buyer information
  buyerName: String,
  buyerAddress: String,
  buyerGstin: String,
  buyerState: String,
  buyerStateCode: String,
  
  // Invoice details
  invoiceNo: String,
  invoiceDate: String,
  eWayBillNo: String,
  deliveryNote: String,
  mode: String,
  reference: String,
  buyerOrderNo: String,
  buyerOrderDate: String,
  dispatchDocNo: String,
  deliveryNoteDate: String,
  dispatchedThrough: String,
  destination: String,
  termsOfDelivery: String,
  
  // Items and calculations
  items: [InvoiceItemSchema],
  cgstRate: Number,
  sgstRate: Number,
  cgstAmount: Number,
  sgstAmount: Number,
  totalTaxableAmount: Number,
  roundedOff: Number,
  totalAmount: Number,
  amountInWords: String,
  
  // Bank details
  bankName: String,
  accountNo: String,
  ifscCode: String,
  branchName: String,
  
  // e-Way Bill details
  ewbMode: String,
  ewbDistance: String,
  ewbTransactionType: String,
  ewbSupplyType: String,
  ewbGeneratedBy: String,
  ewbGeneratedDate: String,
  ewbValidUpto: String,
  vehicleNo: String,
  transporterId: String,
  transporterName: String,
  fromPlace: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
