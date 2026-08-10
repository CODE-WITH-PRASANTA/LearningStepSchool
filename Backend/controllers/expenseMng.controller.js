const Expense = require("../models/expenseMng.model");
const Wallet = require("../models/walletTransaction.model");

const {
  deleteImageFile,
} = require("../middleware/upload");

/* =========================================================
   WALLET HELPER
   ========================================================= */

/*
  Creates wallet debit only once for an expense.

  referenceId = Expense _id

  This prevents duplicate wallet transactions.
*/

const createExpenseWalletDebit = async (expense) => {
  try {
    if (!expense) {
      return;
    }

    /*
      Wallet should be affected only when:

      1. Expense is approved
      2. Payment status is Paid
    */

    if (
      expense.approval !== "Approved" ||
      expense.paymentStatus !== "Paid"
    ) {
      return;
    }

    /*
      Check whether this expense already
      created a wallet transaction.
    */

    const existingTransaction =
      await Wallet.findOne({
        referenceId: expense._id,
        source: "expense",
        type: "debit",
      });

    /*
      Already added to wallet
    */

    if (existingTransaction) {
      return existingTransaction;
    }

    /*
      Create wallet debit
    */

    const transaction = await Wallet.create({
      type: "debit",

      amount: Number(expense.amount),

      source: "expense",

      referenceId: expense._id,

      description:
        `Expense: ${
          expense.expenseFor || "Expense"
        } - ${
          expense.employeeName || ""
        }`,

      createdBy:
        expense.createdBy || null,
    });

    return transaction;

  } catch (error) {
    console.error(
      "CREATE EXPENSE WALLET DEBIT ERROR:",
      error
    );

    throw error;
  }
};


/* =========================================================
   UPDATE EXISTING WALLET DEBIT
   ========================================================= */

const updateExpenseWalletDebit = async (
  expense
) => {
  try {
    if (!expense) {
      return;
    }

    /*
      Find wallet transaction for
      this particular expense.
    */

    const transaction =
      await Wallet.findOne({
        referenceId: expense._id,
        source: "expense",
        type: "debit",
      });

    /*
      Expense is no longer paid/approved.

      Remove wallet debit.
    */

    if (
      expense.approval !== "Approved" ||
      expense.paymentStatus !== "Paid"
    ) {
      if (transaction) {
        await Wallet.findByIdAndDelete(
          transaction._id
        );
      }

      return;
    }

    /*
      Expense is approved + paid.

      If transaction doesn't exist,
      create it.
    */

    if (!transaction) {
      return createExpenseWalletDebit(
        expense
      );
    }

    /*
      Update wallet amount if
      expense amount changed.
    */

    transaction.amount =
      Number(expense.amount);

    transaction.description =
      `Expense: ${
        expense.expenseFor || "Expense"
      } - ${
        expense.employeeName || ""
      }`;

    await transaction.save();

    return transaction;

  } catch (error) {
    console.error(
      "UPDATE EXPENSE WALLET ERROR:",
      error
    );

    throw error;
  }
};


/* =========================================================
   CREATE EXPENSE
   ========================================================= */

const createExpense = async (
  req,
  res
) => {
  try {
    const {
      employeeName,
      expenseDate,
      expenseFor,
      amount,
      description,
      paymentApproval,
      paymentStatus,
      upiNumber,
      createdBy,
    } = req.body;

    /* =====================================================
       REQUIRED VALIDATION
    ===================================================== */

    if (
      !employeeName ||
      !expenseDate ||
      !expenseFor ||
      amount === undefined ||
      amount === "" ||
      !paymentApproval
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Employee name, expense date, expense for, amount and payment approval are required",
      });
    }

    /* =====================================================
       AMOUNT VALIDATION
    ===================================================== */

    if (
      isNaN(Number(amount)) ||
      Number(amount) < 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Amount must be a valid positive number",
      });
    }

    /* =====================================================
       UPI VALIDATION
    ===================================================== */

    if (
      paymentStatus === "UPI" &&
      !upiNumber
    ) {
      return res.status(400).json({
        success: false,

        message:
          "UPI number is required for UPI payment",
      });
    }

    /* =====================================================
       CREATE EXPENSE
       
       Because you want:
       
       Save Expense
            ↓
       Wallet Debit
       
       the expense must be treated as
       Approved + Paid.
    ===================================================== */

    const expense =
      await Expense.create({
        employeeName,

        expenseDate,

        expenseFor,

        amount:
          Number(amount),

        description:
          description || "",

        paymentApproval,

        /*
          Keep the selected payment method
          if your frontend sends it.
        */
        paymentStatus:
          paymentStatus || "Paid",

        upiNumber:
          paymentStatus === "UPI"
            ? upiNumber
            : "",

        /*
          IMPORTANT:
          Expense is immediately approved.
        */
        approval: "Approved",

        bill:
          req.file?.path || "",

        billOriginalName:
          req.file?.originalname || "",

        billMimeType:
          req.file?.mimetype || "",

        createdBy:
          createdBy || null,
      });

    /* =====================================================
       CREATE WALLET DEBIT
       
       Expense:
         ₹5000
       
       Wallet:
         debit ₹5000
       
       referenceId:
         expense._id
    ===================================================== */

    const walletTransaction =
      await createExpenseWalletDebit(
        expense
      );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,

      message:
        "Expense created and wallet updated successfully",

      data: expense,

      walletTransaction:
        walletTransaction || null,
    });

  } catch (error) {

    console.error(
      "CREATE EXPENSE ERROR:",
      error
    );

    /* =====================================================
       DELETE UPLOADED FILE IF DATABASE FAILED
    ===================================================== */

    if (req.file?.path) {
      deleteImageFile(
        req.file.path
      );
    }

    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   GET ALL EXPENSES
   ========================================================= */

const getExpenses = async (
  req,
  res
) => {
  try {

    const {
      search = "",
      paymentStatus,
      approval,
      employeeName,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;


    const query = {};


    /* SEARCH */

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
          expenseFor: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

        {
          paymentStatus: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

      ];
    }


    /* PAYMENT STATUS */

    if (paymentStatus) {
      query.paymentStatus =
        paymentStatus;
    }


    /* APPROVAL */

    if (approval) {
      query.approval =
        approval;
    }


    /* EMPLOYEE */

    if (employeeName) {
      query.employeeName =
        employeeName;
    }


    /* DATE */

    if (
      fromDate ||
      toDate
    ) {

      query.expenseDate = {};


      if (fromDate) {

        query.expenseDate.$gte =
          new Date(
            `${fromDate}T00:00:00.000Z`
          );
      }


      if (toDate) {

        query.expenseDate.$lte =
          new Date(
            `${toDate}T23:59:59.999Z`
          );
      }
    }


    /* PAGINATION */

    const currentPage =
      Math.max(
        parseInt(page) || 1,
        1
      );


    const itemsPerPage =
      Math.max(
        parseInt(limit) || 10,
        1
      );


    const skip =
      (currentPage - 1) *
      itemsPerPage;


    /* DATABASE */

    const [
      expenses,
      total,
    ] = await Promise.all([

      Expense.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage),

      Expense.countDocuments(
        query
      ),

    ]);


    return res.status(200).json({

      success: true,

      data: expenses,

      pagination: {

        total,

        currentPage,

        itemsPerPage,

        totalPages:
          Math.ceil(
            total /
              itemsPerPage
          ),
      },
    });

  } catch (error) {

    console.error(
      "GET EXPENSES ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   GET SINGLE EXPENSE
   ========================================================= */

const getExpenseById = async (
  req,
  res
) => {
  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    if (!expense) {
      return res.status(404).json({

        success: false,

        message:
          "Expense not found",
      });
    }


    return res.status(200).json({

      success: true,

      data: expense,
    });

  } catch (error) {

    console.error(
      "GET SINGLE EXPENSE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   UPDATE EXPENSE
   ========================================================= */

const updateExpense = async (
  req,
  res
) => {
  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    if (!expense) {

      if (req.file?.path) {
        deleteImageFile(
          req.file.path
        );
      }


      return res.status(404).json({

        success: false,

        message:
          "Expense not found",
      });
    }


    const {
      employeeName,
      expenseDate,
      expenseFor,
      amount,
      description,
      paymentApproval,
      paymentStatus,
      upiNumber,
      approval,
      createdBy,
    } = req.body;


    /* AMOUNT */

    if (
      amount !== undefined &&
      (
        isNaN(Number(amount)) ||
        Number(amount) < 0
      )
    ) {

      if (req.file?.path) {
        deleteImageFile(
          req.file.path
        );
      }


      return res.status(400).json({

        success: false,

        message:
          "Invalid amount",
      });
    }


    /* PAYMENT STATUS */

    const finalPaymentStatus =
      paymentStatus ||
      expense.paymentStatus;


    const finalUpiNumber =
      upiNumber !== undefined
        ? upiNumber
        : expense.upiNumber;


    /* UPI */

    if (
      finalPaymentStatus === "UPI" &&
      !finalUpiNumber
    ) {

      if (req.file?.path) {
        deleteImageFile(
          req.file.path
        );
      }


      return res.status(400).json({

        success: false,

        message:
          "UPI number is required for UPI payment",
      });
    }


    /* SAVE OLD BILL */

    const oldBill =
      expense.bill;


    /* UPDATE */

    expense.employeeName =
      employeeName ??
      expense.employeeName;


    expense.expenseDate =
      expenseDate ??
      expense.expenseDate;


    expense.expenseFor =
      expenseFor ??
      expense.expenseFor;


    expense.amount =
      amount !== undefined
        ? Number(amount)
        : expense.amount;


    expense.description =
      description ??
      expense.description;


    expense.paymentApproval =
      paymentApproval ??
      expense.paymentApproval;


    expense.paymentStatus =
      finalPaymentStatus;


    expense.upiNumber =
      finalPaymentStatus === "UPI"
        ? finalUpiNumber
        : "";


    expense.approval =
      approval ??
      expense.approval;


    if (createdBy !== undefined) {
      expense.createdBy =
        createdBy;
    }


    /* NEW BILL */

    if (req.file) {

      expense.bill =
        req.file.path;

      expense.billOriginalName =
        req.file.originalname;

      expense.billMimeType =
        req.file.mimetype;
    }


    /* SAVE */

    await expense.save();


    /*
      VERY IMPORTANT:

      If amount/payment/approval changes,
      update the wallet transaction.
    */

    await updateExpenseWalletDebit(
      expense
    );


    /* DELETE OLD BILL */

    if (
      req.file &&
      oldBill
    ) {

      deleteImageFile(
        oldBill
      );
    }


    return res.status(200).json({

      success: true,

      message:
        "Expense updated successfully",

      data: expense,
    });

  } catch (error) {

    console.error(
      "UPDATE EXPENSE ERROR:",
      error
    );


    if (req.file?.path) {

      deleteImageFile(
        req.file.path
      );
    }


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   DELETE EXPENSE
   ========================================================= */

const deleteExpense = async (
  req,
  res
) => {
  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    if (!expense) {

      return res.status(404).json({

        success: false,

        message:
          "Expense not found",
      });
    }


    /*
      Delete wallet transaction
      before deleting expense.
    */

    await Wallet.deleteMany({
      referenceId:
        expense._id,

      source:
        "expense",
    });


    /* DELETE BILL */

    if (expense.bill) {

      deleteImageFile(
        expense.bill
      );
    }


    /* DELETE EXPENSE */

    await Expense.findByIdAndDelete(
      req.params.id
    );


    return res.status(200).json({

      success: true,

      message:
        "Expense deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE EXPENSE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   APPROVE EXPENSE
   ========================================================= */

const approveExpense = async (
  req,
  res
) => {
  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    if (!expense) {

      return res.status(404).json({

        success: false,

        message:
          "Expense not found",
      });
    }


    /*
      Approve expense
    */

    expense.approval =
      "Approved";


    await expense.save();


    /*
      Wallet will only be affected
      when paymentStatus is Paid.

      If already Paid:
      create wallet debit.

      If Pending:
      no wallet change yet.
    */

    await updateExpenseWalletDebit(
      expense
    );


    return res.status(200).json({

      success: true,

      message:
        "Expense approved successfully",

      data: expense,
    });

  } catch (error) {

    console.error(
      "APPROVE EXPENSE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   MARK EXPENSE AS PAID
   ========================================================= */

const markExpensePaid = async (
  req,
  res
) => {
  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    if (!expense) {

      return res.status(404).json({

        success: false,

        message:
          "Expense not found",
      });
    }


    /*
      Payment must be approved first.
    */

    if (
      expense.approval !==
      "Approved"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Expense must be approved before payment",
      });
    }


    /*
      Mark paid
    */

    expense.paymentStatus =
      "Paid";


    await expense.save();


    /*
      NOW wallet gets debited.
    */

    const walletTransaction =
      await createExpenseWalletDebit(
        expense
      );


    return res.status(200).json({

      success: true,

      message:
        "Expense marked as paid and wallet updated",

      data: expense,

      walletTransaction:
        walletTransaction || null,
    });

  } catch (error) {

    console.error(
      "MARK EXPENSE PAID ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {

  createExpense,

  getExpenses,

  getExpenseById,

  updateExpense,

  deleteExpense,

  approveExpense,

  markExpensePaid,
};