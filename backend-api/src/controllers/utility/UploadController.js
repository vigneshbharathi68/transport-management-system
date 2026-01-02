const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ExcelShipmentService = require("../../services/utilities/ExcelShipmentService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `shipments-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx, .xls) allowed"), false);
    }
  },
});

class UploadController {
  uploadShipments = upload.single("file");

  async bulkShipments(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("📁 Processing:", req.file.filename);
      const filePath = req.file.path;

      // 1. Parse Excel
      const shipments = await ExcelShipmentService.parseShipments(filePath);

      // 2. Bulk insert to database
      const result = await ExcelShipmentService.bulkInsertShipments(shipments);

      // 3. Cleanup file
      fs.unlinkSync(filePath);

      res.status(201).json({
        success: true,
        message: `${result.count} shipments created successfully!`,
        totalParsed: shipments.length,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({
        error: "Failed to process Excel file",
        details: error.message,
      });
    }
  }
}

module.exports = new UploadController();
