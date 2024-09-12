const mongoose = require("mongoose");
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("database connected");
      })
      .catch((err) => {
        console.log("Database connect error" + err);
      });
  }
}

module.exports = new Database();
