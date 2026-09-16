const Fuel = require("../models/Fuel");
const Wallet = require("../models/walletTransaction.model");

const {
  deleteImageFile,
} = require("../middleware/upload");


// =====================================================
// HELPERS
// =====================================================

const normalizeInvoice = (invoiceNo) => {
  return String(invoiceNo || "")
    .trim()
    .toUpperCase();
};


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


    // =================================================
    // VALIDATION
    // =================================================

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


    // =================================================
    // FUEL BILL REQUIRED
    // =================================================

    if (!req.body.fuelBill) {
      return res.status(400).json({
        success: false,
        message: "Fuel bill is required",
      });
    }


    // =================================================
    // NORMALIZE INVOICE
    // =================================================

    const normalizedInvoice =
      normalizeInvoice(invoiceNo);


    // =================================================
    // DUPLICATE INVOICE
    // =================================================

    const existingInvoice =
      await Fuel.findOne({
        invoiceNo: normalizedInvoice,
      });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message:
          "Invoice number already exists",
      });
    }


    // =================================================
    // CALCULATE VALUES
    // =================================================

    const numericKm =
      Number(km) || 0;

    const numericRate =
      Number(rate) || 0;

    const numericVolume =
      Number(volume) || 0;

    const amount =
      Number(
        (
          numericRate *
          numericVolume
        ).toFixed(2)
      );


    // =================================================
    // CREATE FUEL
    // =================================================

    const fuel =
      await Fuel.create({
        employeeName:
          employeeName.trim(),

        pumpName:
          pumpName.trim(),

        date,

        invoiceNo:
          normalizedInvoice,

        km: numericKm,

        rate: numericRate,

        volume: numericVolume,

        amount,

        fuelBill:
          req.body.fuelBill || "",

        fuelBillOriginalName:
          req.file?.originalname || "",

        fuelBillMimeType:
          req.file?.mimetype || "",
      });


    // =================================================
    // CREATE WALLET DEBIT
    // =================================================

    let walletTransaction = null;

    try {
      walletTransaction =
        await Wallet.create({
          type: "debit",

          amount,

          source: "fuel",

          referenceId:
            fuel._id,

          description:
            `Fuel expense - Invoice ${normalizedInvoice}`,

          createdBy:
            req.user?.name ||
            req.body.createdBy ||
            "Admin",
        });
    } catch (walletError) {
      console.error(
        "Wallet transaction error:",
        walletError
      );


      // Rollback fuel
      await Fuel.findByIdAndDelete(
        fuel._id
      );


      // Delete uploaded bill
      if (fuel.fuelBill) {
        deleteImageFile(
          fuel.fuelBill
        );
      }


      return res.status(500).json({
        success: false,
        message:
          "Fuel created but wallet transaction failed. Operation rolled back.",
        error:
          walletError.message,
      });
    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Fuel entry created and wallet debited successfully",

      data: fuel,

      walletTransaction,
    });

  } catch (error) {
    console.error(
      "Create fuel error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create fuel entry",
      error:
        error.message,
    });
  }
};


// =====================================================
// GET ALL FUEL ENTRIES
// =====================================================

const getAllFuel = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      employeeName = "",
      pumpName = "",
      fromDate = "",
      toDate = "",
      minAmount = "",
      maxAmount = "",
      page = 1,
      limit = 10,
    } = req.query;


    const pageNumber =
      Math.max(
        Number(page) || 1,
        1
      );

    const limitNumber =
      Math.max(
        Number(limit) || 10,
        1
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;


    // =================================================
    // QUERY
    // =================================================

    const query = {};


    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      query.$or = [
        {
          employeeName: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

        {
          pumpName: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

        {
          invoiceNo: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },
      ];
    }


    // =================================================
    // EMPLOYEE FILTER
    // =================================================

    if (employeeName.trim()) {
      query.employeeName = {
        $regex:
          employeeName.trim(),
        $options: "i",
      };
    }


    // =================================================
    // PUMP FILTER
    // =================================================

    if (pumpName.trim()) {
      query.pumpName = {
        $regex:
          pumpName.trim(),
        $options: "i",
      };
    }


    // =================================================
    // DATE FILTER
    // =================================================

    if (
      fromDate ||
      toDate
    ) {
      query.date = {};

      if (fromDate) {
        query.date.$gte =
          new Date(
            `${fromDate}T00:00:00`
          );
      }

      if (toDate) {
        query.date.$lte =
          new Date(
            `${toDate}T23:59:59.999`
          );
      }
    }


    // =================================================
    // AMOUNT FILTER
    // =================================================

    if (
      minAmount !== "" ||
      maxAmount !== ""
    ) {
      query.amount = {};

      if (minAmount !== "") {
        query.amount.$gte =
          Number(minAmount);
      }

      if (maxAmount !== "") {
        query.amount.$lte =
          Number(maxAmount);
      }
    }


    // =================================================
    // TOTAL
    // =================================================

    const total =
      await Fuel.countDocuments(
        query
      );


    // =================================================
    // DATA
    // =================================================

    const fuels =
      await Fuel.find(query)
        .sort({
          date: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);


    // =================================================
    // FILTERED TOTALS
    // =================================================

    const totals =
      await Fuel.aggregate([
        {
          $match: query,
        },

        {
          $group: {
            _id: null,

            totalAmount: {
              $sum: "$amount",
            },

            totalVolume: {
              $sum: "$volume",
            },

            totalKM: {
              $sum: "$km",
            },
          },
        },
      ]);


    const totalData =
      totals[0] || {
        totalAmount: 0,
        totalVolume: 0,
        totalKM: 0,
      };


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      data: fuels,

      totals: {
        totalAmount:
          Number(
            totalData.totalAmount ||
              0
          ).toFixed(2),

        totalVolume:
          Number(
            totalData.totalVolume ||
              0
          ).toFixed(2),

        totalKM:
          Number(
            totalData.totalKM ||
              0
          ).toFixed(2),
      },

      pagination: {
        total,

        page: pageNumber,

        limit: limitNumber,

        totalPages:
          Math.ceil(
            total /
              limitNumber
          ),
      },
    });

  } catch (error) {
    console.error(
      "Get fuel error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch fuel entries",

      error:
        error.message,
    });
  }
};


// =====================================================
// GET SINGLE FUEL
// =====================================================

const getFuelById = async (
  req,
  res
) => {
  try {
    const fuel =
      await Fuel.findById(
        req.params.id
      );

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: fuel,
    });

  } catch (error) {
    console.error(
      "Get fuel by ID error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch fuel entry",

      error:
        error.message,
    });
  }
};


// =====================================================
// UPDATE FUEL ENTRY
// =====================================================

const updateFuel = async (
  req,
  res
) => {
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


    // =================================================
    // FIND
    // =================================================

    const fuel =
      await Fuel.findById(
        req.params.id
      );

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message:
          "Fuel entry not found",
      });
    }


    // =================================================
    // NORMALIZE INVOICE
    // =================================================

    const normalizedInvoice =
      invoiceNo
        ? normalizeInvoice(
            invoiceNo
          )
        : fuel.invoiceNo;


    // =================================================
    // DUPLICATE INVOICE
    // =================================================

    if (
      normalizedInvoice !==
      fuel.invoiceNo
    ) {
      const duplicate =
        await Fuel.findOne({
          invoiceNo:
            normalizedInvoice,

          _id: {
            $ne:
              req.params.id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,

          message:
            "Invoice number already exists",
        });
      }
    }


    // =================================================
    // OLD AMOUNT
    // =================================================

    const oldAmount =
      Number(
        fuel.amount || 0
      );


    // =================================================
    // OLD BILL
    // =================================================

    const oldFuelBill =
      fuel.fuelBill;


    // =================================================
    // UPDATE VALUES
    // =================================================

    fuel.employeeName =
      employeeName ??
      fuel.employeeName;

    fuel.pumpName =
      pumpName ??
      fuel.pumpName;

    fuel.date =
      date ??
      fuel.date;

    fuel.invoiceNo =
      normalizedInvoice;

    fuel.km =
      km !== undefined
        ? Number(km) || 0
        : fuel.km;

    fuel.rate =
      rate !== undefined
        ? Number(rate) || 0
        : fuel.rate;

    fuel.volume =
      volume !== undefined
        ? Number(volume) || 0
        : fuel.volume;


    // =================================================
    // NEW AMOUNT
    // =================================================

    const newAmount =
      Number(
        (
          Number(
            fuel.rate || 0
          ) *
          Number(
            fuel.volume || 0
          )
        ).toFixed(2)
      );

    fuel.amount =
      newAmount;


    // =================================================
    // NEW FUEL BILL
    // =================================================

    if (req.body.fuelBill) {
      fuel.fuelBill =
        req.body.fuelBill;

      fuel.fuelBillOriginalName =
        req.file?.originalname ||
        fuel.fuelBillOriginalName;

      fuel.fuelBillMimeType =
        req.file?.mimetype ||
        fuel.fuelBillMimeType;
    }


    // =================================================
    // SAVE
    // =================================================

    await fuel.save();


    // =================================================
    // DELETE OLD BILL
    // =================================================

    if (
      req.body.fuelBill &&
      oldFuelBill &&
      oldFuelBill !==
        req.body.fuelBill
    ) {
      deleteImageFile(
        oldFuelBill
      );
    }


    // =================================================
    // UPDATE WALLET
    // =================================================

    const walletTransaction =
      await Wallet.findOne({
        source: "fuel",

        referenceId:
          fuel._id,
      });


    if (walletTransaction) {
      walletTransaction.amount =
        newAmount;

      walletTransaction.description =
        `Fuel expense - Invoice ${normalizedInvoice}`;

      await walletTransaction.save();

    } else {

      await Wallet.create({
        type: "debit",

        amount: newAmount,

        source: "fuel",

        referenceId:
          fuel._id,

        description:
          `Fuel expense - Invoice ${normalizedInvoice}`,

        createdBy:
          req.user?.name ||
          req.body.createdBy ||
          "Admin",
      });
    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Fuel entry and wallet transaction updated successfully",

      data: fuel,

      oldAmount,

      newAmount,
    });

  } catch (error) {
    console.error(
      "Update fuel error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update fuel entry",

      error:
        error.message,
    });
  }
};


// =====================================================
// DELETE FUEL
// =====================================================

const deleteFuel = async (
  req,
  res
) => {
  try {
    const fuel =
      await Fuel.findById(
        req.params.id
      );

    if (!fuel) {
      return res.status(404).json({
        success: false,

        message:
          "Fuel entry not found",
      });
    }


    // =================================================
    // DELETE WALLET TRANSACTION
    // =================================================

    await Wallet.deleteOne({
      source: "fuel",

      referenceId:
        fuel._id,
    });


    // =================================================
    // DELETE FUEL BILL
    // =================================================

    if (fuel.fuelBill) {
      deleteImageFile(
        fuel.fuelBill
      );
    }


    // =================================================
    // DELETE FUEL
    // =================================================

    await Fuel.findByIdAndDelete(
      req.params.id
    );


    return res.status(200).json({
      success: true,

      message:
        "Fuel entry, fuel bill and wallet transaction deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete fuel error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete fuel entry",

      error:
        error.message,
    });
  }
};


// =====================================================
// FUEL SUMMARY
// =====================================================

const getFuelSummary = async (
  req,
  res
) => {
  try {
    const summary =
      await Fuel.aggregate([
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


    const data =
      summary[0] || {
        totalEntries: 0,
        totalVolume: 0,
        totalAmount: 0,
        totalKM: 0,
      };


    return res.status(200).json({
      success: true,

      data: {
        totalEntries:
          data.totalEntries,

        totalVolume:
          Number(
            data.totalVolume || 0
          ).toFixed(2),

        totalAmount:
          Number(
            data.totalAmount || 0
          ).toFixed(2),

        totalKM:
          Number(
            data.totalKM || 0
          ).toFixed(2),
      },
    });

  } catch (error) {
    console.error(
      "Fuel summary error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get fuel summary",

      error:
        error.message,
    });
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