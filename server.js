const mongoose = require("mongoose");
const MailDev = require("maildev");

require("dotenv").config({
  path: ".env",
});

const maildev = new MailDev({
  smtp: 1025,
  web: 1080,
});

const app = require("./app");
const PORT = process.env.PORT;

// const DB = process.env.DATABASE.replace(
//   /db_password/g,
//   process.env.DB_PASSWORD
// );

// mongoose
//   .connect(DB)
//   .then(() => console.log("✅ Database connected successfully"))
//   .catch((err) => {
//     console.error("❌ Database connection failed", err.message);
//   });
// console.log(process.env.LOCAL_DB);

mongoose
  .connect(process.env.LOCAL_DB)
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
  });
app.listen(PORT, () => {
  console.log(`🚀 Listening to server on port ${PORT}... `);
});

maildev.listen(() => {
  console.log("maildev is running on http://localhost:1080");
});
