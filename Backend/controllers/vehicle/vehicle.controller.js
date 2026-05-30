const Vehicle = require("../../models/Vehicle/vehicle.model");

/* CREATE */

exports.createVehicle = async (
  req,
  res
) => {
  try {
    const vehicle =
      await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      message:
        "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL */

exports.getVehicles = async (
  req,
  res
) => {
  try {
    const search =
      req.query.search || "";

    const query = {
      $or: [
        {
          vehicleType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          vehicleNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          driver: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const vehicles =
      await Vehicle.find(query).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET SINGLE */

exports.getVehicleById =async (req, res) => {
    try {
      const vehicle =
        await Vehicle.findById(
          req.params.id
        );

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message:
            "Vehicle not found",
        });
      }

      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* UPDATE */

exports.updateVehicle = async (req, res) => {
    try {
      const vehicle =
        await Vehicle.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Vehicle updated successfully",
        data: vehicle,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* DELETE */

exports.deleteVehicle = async (req, res) => {
    try {
      await Vehicle.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Vehicle deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };