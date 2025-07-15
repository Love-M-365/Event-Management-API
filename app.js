const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const eventRoutes = require("./routes/eventRoutes");
app.use("/api", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
