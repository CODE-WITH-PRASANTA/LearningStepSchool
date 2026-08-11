const Fuel = require("../models/Fuel");


// =====================================================
// CREATE FUEL ENTRY
// =====================================================

const createFuel = async (req, res) => {
  try {
    const {
      employeeName,
      pumpName,
      date,
      invoiceNo,
      km,
      rate,
      volume,
    } = req.body;

    if (!employeeName) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required",
      });
    }

    if (!pumpName) {
      return res.status(400).json({
        success: false,
        message: "Pump name is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!invoiceNo) {
      return res.status(400).json({
        success: false,
        message: "Invoice number is required",
      });
    }

    const existingInvoice = await Fuel.findOne({
      invoiceNo: invoiceNo.trim().toUpperCase(),
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "Invoice number already exists",
      });
    }

    const fuel = await Fuel.create({
      employeeName,
      pumpName,
      date,
      invoiceNo,
      km: Number(km) || 0,
      rate: Number(rate) || 0,
      volume: Number(volume) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Fuel entry created successfully",
      data: fuel,
    });
  } catch (error) {
    console.error("Create fuel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create fuel entry",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL FUEL ENTRIES
// =====================================================

const getAllFuel = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    let query = {};

    if (search.trim()) {
      query = {
        $or: [
          {
            employeeName: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            pumpName: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            invoiceNo: {
              $regex: search.trim(),
              $options: "i",
            },
          },
        ],
      };
    }

    const total = await Fuel.countDocuments(query);

    const fuels = await Fuel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,

      data: fuels,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get fuel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel entries",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE FUEL ENTRY
// =====================================================

const getFuelById = async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fuel,
    });
  } catch (error) {
    console.error("Get fuel by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel entry",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE FUEL ENTRY
// =====================================================

const updateFuel = async (req, res) => {
  try {
    const {
      employeeName,
      pumpName,
      date,
      invoiceNo,
      km,
      rate,
      volume,
    } = req.body;

    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }


    // Check duplicate invoice
    if (
      invoiceNo &&
      invoiceNo.trim().toUpperCase() !== fuel.invoiceNo
    ) {
      const duplicate = await Fuel.findOne({
        invoiceNo: invoiceNo.trim().toUpperCase(),
        _id: {
          $ne: req.params.id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Invoice number already exists",
        });
      }
    }


    fuel.employeeName =
      employeeName ?? fuel.employeeName;

    fuel.pumpName =
      pumpName ?? fuel.pumpName;

    fuel.date =
      date ?? fuel.date;

    fuel.invoiceNo =
      invoiceNo ?? fuel.invoiceNo;

    fuel.km =
      km !== undefined ? Number(km) : fuel.km;

    fuel.rate =
      rate !== undefined ? Number(rate) : fuel.rate;

    fuel.volume =
      volume !== undefined ? Number(volume) : fuel.volume;


    // amount automatically calculated
    fuel.amount = Number(
      (
        Number(fuel.rate || 0) *
        Number(fuel.volume || 0)
      ).toFixed(2)
    );


    await fuel.save();


    res.status(200).json({
      success: true,
      message: "Fuel entry updated successfully",
      data: fuel,
    });
  } catch (error) {
    console.error("Update fuel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update fuel entry",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE FUEL ENTRY
// =====================================================

const deleteFuel = async (req, res) => {
  try {
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }

    await Fuel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Fuel entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete fuel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete fuel entry",
      error: error.message,
    });
  }
};


// =====================================================
// FUEL SUMMARY
// =====================================================

const getFuelSummary = async (req, res) => {
  try {
    const summary = await Fuel.aggregate([
      {
        $group: {
          _id: null,

          totalEntries: {
            $sum: 1,
          },

          totalVolume: {
            $sum: "$volume",
          },

          totalAmount: {
            $sum: "$amount",
          },

          totalKM: {
            $sum: "$km",
          },
        },
      },
    ]);


    const data = summary[0] || {
      totalEntries: 0,
      totalVolume: 0,
      totalAmount: 0,
      totalKM: 0,
    };


    res.status(200).json({
      success: true,

      data: {
        totalEntries: data.totalEntries,

        totalVolume:
          Number(data.totalVolume || 0).toFixed(2),

        totalAmount:
          Number(data.totalAmount || 0).toFixed(2),

        totalKM:
          Number(data.totalKM || 0).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Fuel summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get fuel summary",
      error: error.message,
    });
  }
};


module.exports = {
  createFuel,
  getAllFuel,
  getFuelById,
  updateFuel,
  deleteFuel,
  getFuelSummary,
};