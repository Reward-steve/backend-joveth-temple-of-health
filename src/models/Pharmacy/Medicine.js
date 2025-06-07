const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  manufacturer: { type: String },
  category: {
    type: String,
    enum: ["Antibiotic", "Painkiller", "Vaccine", "Supplement", "Other"],
    required: true,
  },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  price: { type: Number, required: true },
  dosageForm: {
    type: String,
    enum: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Other"],
    required: true,
  },
  storageLocation: { type: String },
  supplier: { type: String },
});

const Medicine = mongoose.model("Medicine", MedicineSchema);
module.exports = Medicine;

/*

Fields in the Medicine Model
name: This field stores the name of the medicine.
manufacturer: This field stores the name of the manufacturer of the medicine.
dosageForm: This field stores the form of the medicine (e.g., tablet, capsule, liquid).
strength: This field stores the strength of the medicine (e.g., 500mg, 10mg/ml).
stockQuantity: This field stores the quantity of the medicine available in stock.
expiryDate: This field stores the expiry date of the medicine.
Example Usage
Creating a Medicine Record: When a new medicine is added to the pharmacy inventory, a new medicine document is created and saved in the database.
Retrieving Medicine Records: The application can query the Medicine collection to retrieve information about available medicines.
Updating Medicine Stock: The application can update the stock quantity of a medicine when it is dispensed or restocked.

*/
