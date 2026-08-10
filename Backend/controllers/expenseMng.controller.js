const Expense = require("../models/expenseMng.model");
const Wallet = require("../models/walletTransaction.model");

const {
  deleteImageFile,
} = require("../middleware/upload");


/* =========================================================
   CREATE WALLET DEBIT FOR APPROVED EXPENSE
========================================================= */

const createExpenseWalletDebit = async (expense) => {
  try {
    if (!expense) {
      return null;
    }

    /*
      IMPORTANT:

      Wallet is updated when the expense is APPROVED.

      We do NOT check paymentStatus here because
      your Expense model does not support "Paid".
    */

    if (expense.approval !== "Approved") {
      return null;
    }

    /* -----------------------------------------------------
       CHECK EXISTING WALLET TRANSACTION
    ----------------------------------------------------- */

    const existingTransaction =
      await Wallet.findOne({
        referenceId: expense._id,
        source: "expense",
        type: "debit",
      });

    /*
      Prevent duplicate wallet debit.
    */

    if (existingTransaction) {
      return existingTransaction;
    }

    /* -----------------------------------------------------
       CREATE WALLET DEBIT
    ----------------------------------------------------- */

    const transaction =
      await Wallet.create({
        type: "debit",

        amount: Number(
          expense.amount
        ),

        source: "expense",

        referenceId:
          expense._id,

        description:
          `Expense: ${
            expense.expenseFor ||
            "Expense"
          } - ${
            expense.employeeName ||
            ""
          }`,

        createdBy:
          expense.createdBy ||
          "Admin",
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
      return null;
    }

    /* -----------------------------------------------------
       FIND WALLET TRANSACTION
    ----------------------------------------------------- */

    const transaction =
      await Wallet.findOne({
        referenceId:
          expense._id,

        source:
          "expense",

        type:
          "debit",
      });

    /* -----------------------------------------------------
       IF EXPENSE IS NOT APPROVED

       Remove wallet transaction if one exists.
    ----------------------------------------------------- */

    if (
      expense.approval !==
      "Approved"
    ) {
      if (transaction) {
        await Wallet.findByIdAndDelete(
          transaction._id
        );
      }

      return null;
    }

    /* -----------------------------------------------------
       APPROVED BUT WALLET TRANSACTION
       DOES NOT EXIST
    ----------------------------------------------------- */

    if (!transaction) {
      return createExpenseWalletDebit(
        expense
      );
    }

    /* -----------------------------------------------------
       UPDATE EXISTING WALLET TRANSACTION

       This is useful if Admin modifies
       the expense amount after approval.
    ----------------------------------------------------- */

    transaction.amount =
      Number(expense.amount);

    transaction.description =
      `Expense: ${
        expense.expenseFor ||
        "Expense"
      } - ${
        expense.employeeName ||
        ""
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


    /* -----------------------------------------------------
       REQUIRED VALIDATION
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       AMOUNT VALIDATION
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       UPI VALIDATION
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       CREATE EXPENSE
       
       New expense starts as Pending.

       Wallet is NOT affected yet.
    ----------------------------------------------------- */

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

        paymentStatus:
          paymentStatus ||
          "Pending",

        upiNumber:
          paymentStatus === "UPI"
            ? upiNumber
            : "",

        approval:
          "Pending",

        bill:
          req.file?.path ||
          "",

        billOriginalName:
          req.file?.originalname ||
          "",

        billMimeType:
          req.file?.mimetype ||
          "",

        createdBy:
          createdBy ||
          null,
      });


    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    return res.status(201).json({
      success: true,

      message:
        "Expense created successfully",

      data:
        expense,
    });

  } catch (error) {

    console.error(
      "CREATE EXPENSE ERROR:",
      error
    );


    /* -----------------------------------------------------
       DELETE UPLOADED FILE IF DATABASE FAILED
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (
      search &&
      search.trim()
    ) {

      const searchText =
        search.trim();

      query.$or = [

        {
          employeeName: {
            $regex:
              searchText,
            $options: "i",
          },
        },

        {
          expenseFor: {
            $regex:
              searchText,
            $options: "i",
          },
        },

        {
          paymentStatus: {
            $regex:
              searchText,
            $options: "i",
          },
        },

      ];
    }


    /* -----------------------------------------------------
       PAYMENT STATUS FILTER
    ----------------------------------------------------- */

    if (paymentStatus) {
      query.paymentStatus =
        paymentStatus;
    }


    /* -----------------------------------------------------
       APPROVAL FILTER
    ----------------------------------------------------- */

    if (approval) {
      query.approval =
        approval;
    }


    /* -----------------------------------------------------
       EMPLOYEE FILTER
    ----------------------------------------------------- */

    if (employeeName) {
      query.employeeName =
        employeeName;
    }


    /* -----------------------------------------------------
       DATE FILTER
    ----------------------------------------------------- */

    if (
      fromDate ||
      toDate
    ) {

      query.expenseDate = {};


      if (fromDate) {

        const startDate =
          new Date(
            `${fromDate}T00:00:00.000Z`
          );

        if (
          !isNaN(
            startDate.getTime()
          )
        ) {
          query.expenseDate.$gte =
            startDate;
        }
      }


      if (toDate) {

        const endDate =
          new Date(
            `${toDate}T23:59:59.999Z`
          );

        if (
          !isNaN(
            endDate.getTime()
          )
        ) {
          query.expenseDate.$lte =
            endDate;
        }
      }
    }


    /* -----------------------------------------------------
       PAGINATION
    ----------------------------------------------------- */

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );


    const itemsPerPage =
      Math.max(
        Number(limit) || 10,
        1
      );


    const skip =
      (currentPage - 1) *
      itemsPerPage;


    /* -----------------------------------------------------
       FETCH DATA
    ----------------------------------------------------- */

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

      data:
        expenses,

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

      data:
        expense,
    });

  } catch (error) {

    console.error(
      "GET EXPENSE ERROR:",
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


    /* -----------------------------------------------------
       AMOUNT VALIDATION
    ----------------------------------------------------- */

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
          "Amount must be a valid positive number",
      });
    }


    /* -----------------------------------------------------
       PAYMENT STATUS
    ----------------------------------------------------- */

    const finalPaymentStatus =
      paymentStatus !== undefined
        ? paymentStatus
        : expense.paymentStatus;


    /* -----------------------------------------------------
       UPI
    ----------------------------------------------------- */

    const finalUpiNumber =
      upiNumber !== undefined
        ? upiNumber
        : expense.upiNumber;


    if (
      finalPaymentStatus ===
        "UPI" &&
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


    /* -----------------------------------------------------
       KEEP OLD BILL
    ----------------------------------------------------- */

    const oldBill =
      expense.bill;


    /* -----------------------------------------------------
       UPDATE FIELDS
    ----------------------------------------------------- */

    if (
      employeeName !== undefined
    ) {
      expense.employeeName =
        employeeName;
    }


    if (
      expenseDate !== undefined
    ) {
      expense.expenseDate =
        expenseDate;
    }


    if (
      expenseFor !== undefined
    ) {
      expense.expenseFor =
        expenseFor;
    }


    if (
      amount !== undefined
    ) {
      expense.amount =
        Number(amount);
    }


    if (
      description !== undefined
    ) {
      expense.description =
        description;
    }


    if (
      paymentApproval !==
      undefined
    ) {
      expense.paymentApproval =
        paymentApproval;
    }


    if (
      paymentStatus !==
      undefined
    ) {
      expense.paymentStatus =
        paymentStatus;
    }


    expense.upiNumber =
      finalPaymentStatus ===
        "UPI"
        ? finalUpiNumber
        : "";


    if (
      approval !== undefined
    ) {
      expense.approval =
        approval;
    }


    if (
      createdBy !== undefined
    ) {
      expense.createdBy =
        createdBy;
    }


    /* -----------------------------------------------------
       NEW BILL
    ----------------------------------------------------- */

    if (req.file) {

      expense.bill =
        req.file.path;

      expense.billOriginalName =
        req.file.originalname;

      expense.billMimeType =
        req.file.mimetype;
    }


    /* -----------------------------------------------------
       SAVE EXPENSE
    ----------------------------------------------------- */

    await expense.save();


    /* -----------------------------------------------------
       UPDATE WALLET

       If approved:
         create/update wallet debit.

       If not approved:
         remove wallet debit.
    ----------------------------------------------------- */

    await updateExpenseWalletDebit(
      expense
    );


    /* -----------------------------------------------------
       DELETE OLD BILL
    ----------------------------------------------------- */

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

      data:
        expense,
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


    /* -----------------------------------------------------
       REMOVE WALLET TRANSACTION
    ----------------------------------------------------- */

    await Wallet.deleteMany({

      referenceId:
        expense._id,

      source:
        "expense",

      type:
        "debit",
    });


    /* -----------------------------------------------------
       DELETE BILL
    ----------------------------------------------------- */

    if (expense.bill) {

      deleteImageFile(
        expense.bill
      );
    }


    /* -----------------------------------------------------
       DELETE EXPENSE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       ALREADY APPROVED
    ----------------------------------------------------- */

    if (
      expense.approval ===
      "Approved"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Expense is already approved",
      });
    }


    /* -----------------------------------------------------
       APPROVE

       IMPORTANT:

       DO NOT SET:

       expense.paymentStatus = "Paid";

       Your Expense model does not accept
       "Paid" as a paymentStatus enum value.
    ----------------------------------------------------- */

    expense.approval =
      "Approved";


    await expense.save();


    /* -----------------------------------------------------
       CREATE WALLET DEBIT
    ----------------------------------------------------- */

    const walletTransaction =
      await createExpenseWalletDebit(
        expense
      );


    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    return res.status(200).json({

      success: true,

      message:
        "Expense approved and wallet updated successfully",

      data:
        expense,

      walletTransaction:
        walletTransaction || null,
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
   EXPORTS
========================================================= */

module.exports = {

  createExpense,

  getExpenses,

  getExpenseById,

  updateExpense,

  deleteExpense,

  approveExpense,
};