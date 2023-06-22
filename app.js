const express = require("express");

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));   ==============> allowing form to be porsed
// field of imports
const authenticate = require("./userServices/authentication");

// using app
app.get("/", authenticate.Test);
app.get("/api/users", authenticate.fetchData);
app.delete("/api/:id", authenticate.deleteAccount);
app.post(
  "/api/registeruser",
  authenticate.emailVerify,
  authenticate.registerUser
);
app.get("/api/resetassword", authenticate.sendResetPassword);

// listening and ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  return `@http://localhost:${PORT}`;
});
