const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
app.use("/api", eventRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
