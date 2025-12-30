const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/shipments", require("./routes/ShipmentRoutes"));
app.use("/api/materials", require("./routes/MaterialRoutes"));
app.use("/api/transports", require("./routes/TransportRoutes"));

app.listen(PORT, () => {
  console.log(`🚚 Transport API running on http://localhost:${PORT}`);
});
