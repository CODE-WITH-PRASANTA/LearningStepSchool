const mongoose = require("mongoose");

const Expense = require("../models/expense.model");
const Wallet = require("../models/walletTransaction.model");

const {
  deleteImageFile,
} = require("../middleware/upload");

// =====================================================
// CREATE EXPENSE
// =====================================================

exports.createExpense = async (req, res) => {
  try {
    console.log(
      "========== CREATE EXPENSE =========="
    );

    console.log("BODY:", req.body);

    console.log(
      "FILE:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
          }
        : "No file"
    );

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!req.body.head) {
      return res.status(400).json({
        success: false,
        message: "Expense head is required",
      });
    }

    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Expense name is required",
      });
    }

    if (
      req.body.amount === undefined ||
      req.body.amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    if (!req.body.date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // -------------------------------------------------
    // CREATE EXPENSE
    // -------------------------------------------------

    const expenseData = {
      head: req.body.head,

      accountType:
        req.body.accountType || "Savings",

      accountName:
        req.body.accountName || "",

      name: req.body.name,

      amount: Number(req.body.amount),

      invoice:
        req.body.invoice || "",

      date: req.body.date,

      paymentMode:
        req.body.paymentMode || "Cash",

      description:
        req.body.description || "",

      createdBy:
        req.body.createdBy || "Admin",

      approvedBy:
        req.body.approvedBy || "-",

      // -------------------------------------------------
      // BILL PATH
      // -------------------------------------------------

      bill:
        req.body.bill ||
        req.file?.path ||
        "",
    };

    const expense =
      await Expense.create(expenseData);

    // -------------------------------------------------
    // CREATE WALLET TRANSACTION
    // -------------------------------------------------

    const walletTx =
      await Wallet.create({
        type: "debit",

        amount: expense.amount,

        source: "expense",

        referenceId: expense._id,

        description: expense.name,
      });

    // -------------------------------------------------
    // LINK WALLET
    // -------------------------------------------------

    expense.walletLinked = true;

    expense.walletTransactionId =
      walletTx._id;

    await expense.save();

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
      expense,
      walletTransaction: walletTx,
    });
  } catch (err) {
    console.error(
      "🔥 CREATE EXPENSE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// GET ALL EXPENSES
// =====================================================

exports.getExpenses = async (req, res) => {
  try {
    const expenses =
      await Expense.find()
        .sort({
          createdAt: -1,
        });

    res.json(expenses);
  } catch (err) {
    console.error(
      "GET EXPENSE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// UPDATE EXPENSE
// =====================================================

exports.updateExpense = async (req, res) => {
  try {
    const expenseId =
      req.params.id;

    console.log(
      "========== UPDATE EXPENSE =========="
    );

    console.log(
      "ID:",
      expenseId
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILE:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname:
              req.file.originalname,
            mimetype:
              req.file.mimetype,
            path: req.file.path,
          }
        : "No new bill"
    );

    // -------------------------------------------------
    // VALIDATE ID
    // -------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        expenseId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // -------------------------------------------------
    // FIND OLD EXPENSE
    // -------------------------------------------------

    const oldExpense =
      await Expense.findById(
        expenseId
      );

    if (!oldExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // -------------------------------------------------
    // PREPARE UPDATE
    // -------------------------------------------------

    const updateData = {};

    if (
      req.body.head !== undefined
    ) {
      updateData.head =
        req.body.head;
    }

    if (
      req.body.accountType !==
      undefined
    ) {
      updateData.accountType =
        req.body.accountType;
    }

    if (
      req.body.accountName !==
      undefined
    ) {
      updateData.accountName =
        req.body.accountName;
    }

    if (
      req.body.name !== undefined
    ) {
      updateData.name =
        req.body.name;
    }

    if (
      req.body.amount !== undefined &&
      req.body.amount !== ""
    ) {
      updateData.amount =
        Number(req.body.amount);
    }

    if (
      req.body.invoice !==
      undefined
    ) {
      updateData.invoice =
        req.body.invoice;
    }

    if (
      req.body.date !== undefined
    ) {
      updateData.date =
        req.body.date;
    }

    if (
      req.body.paymentMode !==
      undefined
    ) {
      updateData.paymentMode =
        req.body.paymentMode;
    }

    if (
      req.body.description !==
      undefined
    ) {
      updateData.description =
        req.body.description;
    }

    if (
      req.body.createdBy !==
      undefined
    ) {
      updateData.createdBy =
        req.body.createdBy;
    }

    if (
      req.body.approvedBy !==
      undefined
    ) {
      updateData.approvedBy =
        req.body.approvedBy;
    }

    // -------------------------------------------------
    // NEW BILL
    // -------------------------------------------------

    if (req.file) {
      updateData.bill =
        req.file.path;

      // ------------------------------------------------
      // DELETE OLD BILL
      // ------------------------------------------------

      if (
        oldExpense.bill &&
        oldExpense.bill !==
          req.file.path
      ) {
        deleteImageFile(
          oldExpense.bill
        );
      }
    }

    // -------------------------------------------------
    // UPDATE EXPENSE
    // -------------------------------------------------

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        expenseId,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    // -------------------------------------------------
    // UPDATE WALLET
    // -------------------------------------------------

    const walletTx =
      await Wallet.findOne({
        referenceId: expenseId,
      });

    if (walletTx) {
      if (
        req.body.amount !==
          undefined &&
        req.body.amount !== ""
      ) {
        walletTx.amount =
          updatedExpense.amount;
      }

      if (
        req.body.name !==
          undefined
      ) {
        walletTx.description =
          updatedExpense.name;
      }

      walletTx.updatedAt =
        new Date();

      await walletTx.save();
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.json({
      success: true,
      message:
        "Expense updated successfully",
      data: updatedExpense,
      expense: updatedExpense,
      walletTransaction:
        walletTx || null,
    });
  } catch (err) {
    console.error(
      "🔥 UPDATE EXPENSE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// SEARCH EXPENSES
// =====================================================

exports.searchExpenses = async (
  req,
  res
) => {
  try {
    const {
      head,
      payment,
      from,
      to,
      text,
    } = req.query;

    const filter = {};

    // -------------------------------------------------
    // HEAD
    // -------------------------------------------------

    if (head) {
      filter.head = head;
    }

    // -------------------------------------------------
    // PAYMENT
    // -------------------------------------------------

    if (payment) {
      filter.paymentMode =
        payment;
    }

    // -------------------------------------------------
    // DATE
    // -------------------------------------------------

    if (from || to) {
      filter.date = {};

      if (from) {
        const fromDate =
          new Date(from);

        fromDate.setHours(
          0,
          0,
          0,
          0
        );

        filter.date.$gte =
          fromDate;
      }

      if (to) {
        const toDate =
          new Date(to);

        toDate.setHours(
          23,
          59,
          59,
          999
        );

        filter.date.$lte =
          toDate;
      }
    }

    // -------------------------------------------------
    // TEXT SEARCH
    // -------------------------------------------------

    if (text) {
      filter.$or = [
        {
          name: {
            $regex: text,
            $options: "i",
          },
        },
        {
          description: {
            $regex: text,
            $options: "i",
          },
        },
        {
          invoice: {
            $regex: text,
            $options: "i",
          },
        },
        {
          head: {
            $regex: text,
            $options: "i",
          },
        },
      ];
    }

    const expenses =
      await Expense.find(filter)
        .sort({
          createdAt: -1,
        });

    res.json(expenses);
  } catch (err) {
    console.error(
      "SEARCH EXPENSE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// DELETE EXPENSE
// =====================================================

exports.deleteExpense = async (
  req,
  res
) => {
  try {
    const expenseId =
      req.params.id;

    // -------------------------------------------------
    // VALIDATE ID
    // -------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        expenseId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // -------------------------------------------------
    // FIND EXPENSE
    // -------------------------------------------------

    const expense =
      await Expense.findById(
        expenseId
      );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // -------------------------------------------------
    // DELETE WALLET TRANSACTION
    // -------------------------------------------------

    await Wallet.deleteOne({
      referenceId: expenseId,
    });

    // -------------------------------------------------
    // DELETE BILL FILE
    // -------------------------------------------------

    if (expense.bill) {
      deleteImageFile(
        expense.bill
      );
    }

    // -------------------------------------------------
    // DELETE EXPENSE
    // -------------------------------------------------

    await Expense.findByIdAndDelete(
      expenseId
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.json({
      success: true,
      message:
        "Expense deleted successfully",
    });
  } catch (err) {
    console.error(
      "DELETE EXPENSE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};