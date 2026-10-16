
const Fuel = require("../models/Fuel");
const Wallet = require("../models/walletTransaction.model");
const { deleteImageFile } = require("../middleware/upload");

// =====================================================
// HELPERS
// =====================================================

const normalizeInvoice = (invoiceNo) =>
  String(invoiceNo || "").trim().toUpperCase();

const getText = (value) =>
  value === undefined || value === null ? "" : String(value).trim();

const getErrorResponse = (res, message, error) =>
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });

// =====================================================
// CREATE FUEL ENTRY
// =====================================================

const createFuel = async (req, res) => {
  try {
    const {
      employeeName,
      pumpName,
      vehicle,
      description,
      date,
      invoiceNo,
      km,
      rate,
      volume,
      fuelBill,
    } = req.body;

    if (!getText(employeeName)) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required",
      });
    }

    if (!getText(pumpName)) {
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

    if (!getText(invoiceNo)) {
      return res.status(400).json({
        success: false,
        message: "Invoice number is required",
      });
    }

    if (!getText(fuelBill)) {
      return res.status(400).json({
        success: false,
        message: "Fuel bill is required",
      });
    }

    const normalizedInvoice = normalizeInvoice(invoiceNo);

    const existingInvoice = await Fuel.findOne({
      invoiceNo: normalizedInvoice,
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "Invoice number already exists",
      });
    }

    const numericKm = Number(km) || 0;
    const numericRate = Number(rate) || 0;
    const numericVolume = Number(volume) || 0;

    if (numericKm < 0 || numericRate < 0 || numericVolume < 0) {
      return res.status(400).json({
        success: false,
        message: "KM, rate and volume cannot be negative",
      });
    }

    const amount = Number(
      (numericRate * numericVolume).toFixed(2)
    );

    // Save all fuel fields, including vehicle and description.
    const fuel = await Fuel.create({
      employeeName: getText(employeeName),
      pumpName: getText(pumpName),
      vehicle: getText(vehicle),
      description: getText(description),
      date,
      invoiceNo: normalizedInvoice,
      km: numericKm,
      rate: numericRate,
      volume: numericVolume,
      amount,
      fuelBill: getText(fuelBill),
      fuelBillOriginalName: req.file?.originalname || "",
      fuelBillMimeType: req.file?.mimetype || "",
    });

    let walletTransaction;

    try {
      walletTransaction = await Wallet.create({
        type: "debit",
        amount,
        source: "fuel",
        referenceId: fuel._id,
        description: `Fuel expense - Invoice ${normalizedInvoice}`,
        createdBy:
          req.user?.name || req.body.createdBy || "Admin",
      });
    } catch (walletError) {
      console.error("Wallet transaction error:", walletError);

      await Fuel.findByIdAndDelete(fuel._id);

      if (fuel.fuelBill) {
        deleteImageFile(fuel.fuelBill);
      }

      return res.status(500).json({
        success: false,
        message:
          "Wallet transaction failed. Fuel entry was rolled back.",
        error: walletError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Fuel entry created and wallet debited successfully",
      data: fuel,
      walletTransaction,
    });
  } catch (error) {
    console.error("Create fuel error:", error);
    return getErrorResponse(res, "Failed to create fuel entry", error);
  }
};

// =====================================================
// GET ALL FUEL ENTRIES
// =====================================================

const getAllFuel = async (req, res) => {
  try {
    const {
      search = "",
      employeeName = "",
      pumpName = "",
      vehicle = "",
      fromDate = "",
      toDate = "",
      minAmount = "",
      maxAmount = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};

    if (search.trim()) {
      const searchRegex = {
        $regex: search.trim(),
        $options: "i",
      };

      query.$or = [
        { employeeName: searchRegex },
        { pumpName: searchRegex },
        { vehicle: searchRegex },
        { description: searchRegex },
        { invoiceNo: searchRegex },
      ];
    }

    if (employeeName.trim()) {
      query.employeeName = {
        $regex: employeeName.trim(),
        $options: "i",
      };
    }

    if (pumpName.trim()) {
      query.pumpName = {
        $regex: pumpName.trim(),
        $options: "i",
      };
    }

    if (vehicle.trim()) {
      query.vehicle = {
        $regex: vehicle.trim(),
        $options: "i",
      };
    }

    if (fromDate || toDate) {
      query.date = {};

      if (fromDate) {
        query.date.$gte = new Date(`${fromDate}T00:00:00`);
      }

      if (toDate) {
        query.date.$lte = new Date(`${toDate}T23:59:59.999`);
      }
    }

    if (minAmount !== "" || maxAmount !== "") {
      query.amount = {};

      if (minAmount !== "") {
        query.amount.$gte = Number(minAmount);
      }

      if (maxAmount !== "") {
        query.amount.$lte = Number(maxAmount);
      }
    }

    const [total, fuels, totals] = await Promise.all([
      Fuel.countDocuments(query),

      Fuel.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Fuel.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalVolume: { $sum: "$volume" },
            totalKM: { $sum: "$km" },
          },
        },
      ]),
    ]);

    const totalData = totals[0] || {
      totalAmount: 0,
      totalVolume: 0,
      totalKM: 0,
    };

    return res.status(200).json({
      success: true,
      data: fuels,
      totals: {
        totalAmount: Number(totalData.totalAmount || 0).toFixed(2),
        totalVolume: Number(totalData.totalVolume || 0).toFixed(2),
        totalKM: Number(totalData.totalKM || 0).toFixed(2),
      },
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get fuel error:", error);
    return getErrorResponse(res, "Failed to fetch fuel entries", error);
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

    return res.status(200).json({
      success: true,
      data: fuel,
    });
  } catch (error) {
    console.error("Get fuel by ID error:", error);
    return getErrorResponse(res, "Failed to fetch fuel entry", error);
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
      vehicle,
      description,
      date,
      invoiceNo,
      km,
      rate,
      volume,
      fuelBill,
    } = req.body;

    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel entry not found",
      });
    }

    const normalizedInvoice = invoiceNo
      ? normalizeInvoice(invoiceNo)
      : fuel.invoiceNo;

    if (normalizedInvoice !== fuel.invoiceNo) {
      const duplicate = await Fuel.findOne({
        invoiceNo: normalizedInvoice,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Invoice number already exists",
        });
      }
    }

    const oldAmount = Number(fuel.amount || 0);
    const oldFuelBill = fuel.fuelBill;

    // Update regular fields only when they are provided.
    if (employeeName !== undefined) {
      fuel.employeeName = getText(employeeName);
    }

    if (pumpName !== undefined) {
      fuel.pumpName = getText(pumpName);
    }

    // These two fields were missing in the old controller.
    if (vehicle !== undefined) {
      fuel.vehicle = getText(vehicle);
    }

    if (description !== undefined) {
      fuel.description = getText(description);
    }

    if (date !== undefined && date !== "") {
      fuel.date = date;
    }

    fuel.invoiceNo = normalizedInvoice;

    if (km !== undefined && km !== "") {
      fuel.km = Number(km) || 0;
    }

    if (rate !== undefined && rate !== "") {
      fuel.rate = Number(rate) || 0;
    }

    if (volume !== undefined && volume !== "") {
      fuel.volume = Number(volume) || 0;
    }

    if (
      Number(fuel.km) < 0 ||
      Number(fuel.rate) < 0 ||
      Number(fuel.volume) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "KM, rate and volume cannot be negative",
      });
    }

    const newAmount = Number(
      (
        Number(fuel.rate || 0) *
        Number(fuel.volume || 0)
      ).toFixed(2)
    );

    fuel.amount = newAmount;

    if (fuelBill !== undefined && getText(fuelBill)) {
      fuel.fuelBill = getText(fuelBill);
      fuel.fuelBillOriginalName =
        req.file?.originalname || fuel.fuelBillOriginalName;
      fuel.fuelBillMimeType =
        req.file?.mimetype || fuel.fuelBillMimeType;
    }

    await fuel.save();

    // Delete the previous bill only after the new record is saved.
    if (
      fuelBill &&
      oldFuelBill &&
      oldFuelBill !== fuel.fuelBill
    ) {
      deleteImageFile(oldFuelBill);
    }

    // Update the matching wallet transaction.
    let walletTransaction = await Wallet.findOne({
      source: "fuel",
      referenceId: fuel._id,
    });

    if (walletTransaction) {
      walletTransaction.amount = newAmount;
      walletTransaction.description =
        `Fuel expense - Invoice ${normalizedInvoice}`;

      await walletTransaction.save();
    } else {
      walletTransaction = await Wallet.create({
        type: "debit",
        amount: newAmount,
        source: "fuel",
        referenceId: fuel._id,
        description: `Fuel expense - Invoice ${normalizedInvoice}`,
        createdBy:
          req.user?.name || req.body.createdBy || "Admin",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fuel entry and wallet transaction updated successfully",
      data: fuel,
      oldAmount,
      newAmount,
      walletTransaction,
    });
  } catch (error) {
    console.error("Update fuel error:", error);
    return getErrorResponse(res, "Failed to update fuel entry", error);
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

    await Wallet.deleteOne({
      source: "fuel",
      referenceId: fuel._id,
    });

    if (fuel.fuelBill) {
      deleteImageFile(fuel.fuelBill);
    }

    await Fuel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message:
        "Fuel entry, fuel bill and wallet transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete fuel error:", error);
    return getErrorResponse(res, "Failed to delete fuel entry", error);
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
          totalEntries: { $sum: 1 },
          totalVolume: { $sum: "$volume" },
          totalAmount: { $sum: "$amount" },
          totalKM: { $sum: "$km" },
        },
      },
    ]);

    const data = summary[0] || {
      totalEntries: 0,
      totalVolume: 0,
      totalAmount: 0,
      totalKM: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalEntries: data.totalEntries,
        totalVolume: Number(data.totalVolume || 0).toFixed(2),
        totalAmount: Number(data.totalAmount || 0).toFixed(2),
        totalKM: Number(data.totalKM || 0).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Fuel summary error:", error);
    return getErrorResponse(res, "Failed to get fuel summary", error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createFuel,
  getAllFuel,
  getFuelById,
  updateFuel,
  deleteFuel,
  getFuelSummary,
};
