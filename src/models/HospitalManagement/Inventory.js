const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    storageLocation: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;

/*Example Usage
Creating an Inventory Record: When a new batch of medicine is added to the inventory, a new inventory document is created and saved in the database.
Retrieving Inventory Records: The application can query the Inventory collection to retrieve information about the current stock of medicines.
Updating Inventory Stock: The application can update the quantity of a medicine in the inventory when it is dispensed or restocked.
 */
