const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
      unique: true,
    },
    coverageDetails: {
      type: String,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);
module.exports = Insurance;

/*


Fields in the Insurance Model
patientId: This field stores the reference to the patient associated with the insurance. It uses the ObjectId type to reference the Patient model.
provider: This field stores the name of the insurance provider.
policyNumber: This field stores the policy number of the insurance. It is unique to ensure no duplicate policies.
coverageDetails: This field stores the details of the insurance coverage.
validFrom: This field stores the start date of the insurance policy.
validTo: This field stores the end date of the insurance policy.
Example Usage
Creating an Insurance Record: When a new insurance policy is added for a patient, a new insurance document is created and saved in the database.
Retrieving Insurance Records: The application can query the Insurance collection to retrieve insurance information for a specific patient.
Updating Insurance Information: The application can update the insurance details when there are changes in the policy or coverage.
Summary
*/
