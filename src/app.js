const express = require("express");
const cors = require("cors");
const shipmentRoutes = require("./routes/ShipmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/shipments", shipmentRoutes);

app.listen(PORT, () => {
  console.log(`🚚 Transport API running on http://localhost:${PORT}`);
});
