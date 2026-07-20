const VehicleKm = require("../../models/Vehicle/vehicleKm.model");

// Create
exports.createVehicleKm = async (req, res) => {
  try {
    const { vehicle, date, closingKm } = req.body;

    const lastLog = await VehicleKm.findOne({ vehicle })
      .sort({ date: -1, createdAt: -1 });

    const openingKm = lastLog ? lastLog.closingKm : 0;
    const runningKm = Number(closingKm) - openingKm;

    if (runningKm < 0) {
      return res.status(400).json({
        success: false,
        message: `Closing KM cannot be less than ${openingKm}`,
      });
    }

    const log = await VehicleKm.create({
      vehicle,
      date,
      openingKm,
      closingKm,
      runningKm,
    });

    res.status(201).json({
      success: true,
      message: "KM Log Saved Successfully",
      data: log,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All
exports.getVehicleKm = async (req, res) => {
  try {
    const query = {};
    const { date } = req.query;

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: "Date must be in YYYY-MM-DD format.",
        });
      }

      const startDate = new Date(`${date}T00:00:00.000Z`);

      if (
        Number.isNaN(startDate.getTime()) ||
        startDate.toISOString().slice(0, 10) !== date
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid date.",
        });
      }

      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + 1);

      query.date = { $gte: startDate, $lt: endDate };
    }

    const logs = await VehicleKm.find(query)
      .populate("vehicle", "vehicleNo driver vehicleType")
      .sort({ date: -1 });

    res.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update
exports.updateVehicleKm = async (req, res) => {
  try {
    const log = await VehicleKm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated Successfully",
      data: log,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete
exports.deleteVehicleKm = async (req, res) => {
  try {
    await VehicleKm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
