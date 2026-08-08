const Expense = require("../models/expenseMng.model");

const {
  deleteImageFile,
} = require("../middleware/upload");


/* =====================================================
   CREATE EXPENSE
===================================================== */

const createExpense = async (req, res) => {
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
    } = req.body;


    /* ---------------- REQUIRED VALIDATION ---------------- */

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


    /* ---------------- AMOUNT VALIDATION ---------------- */

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


    /* ---------------- UPI VALIDATION ---------------- */

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


    /* ---------------- CREATE ---------------- */

    const expense = await Expense.create({
      employeeName,

      expenseDate,

      expenseFor,

      amount: Number(amount),

      description: description || "",

      paymentApproval,

      paymentStatus:
        paymentStatus || "Pending",

      upiNumber:
        paymentStatus === "UPI"
          ? upiNumber
          : "",

      approval: "Pending",

      /*
       * req.file.path is created
       * by your convertToWebp middleware.
       */
      bill: req.file?.path || "",

      billOriginalName:
        req.file?.originalname || "",

      billMimeType:
        req.file?.mimetype || "",
    });


    return res.status(201).json({
      success: true,

      message:
        "Expense created successfully",

      data: expense,
    });

  } catch (error) {

    console.error(
      "CREATE EXPENSE ERROR:",
      error
    );


    /* Delete uploaded file if DB failed */

    if (req.file?.path) {
      deleteImageFile(req.file.path);
    }


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================================
   GET ALL EXPENSES
===================================================== */

const getExpenses = async (req, res) => {
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


    /* =================================================
       SEARCH
    ================================================= */

    if (search.trim()) {

      query.$or = [

        {
          employeeName: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          expenseFor: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          paymentStatus: {
            $regex: search.trim(),
            $options: "i",
          },
        },

      ];
    }


    /* =================================================
       FILTER PAYMENT STATUS
    ================================================= */

    if (paymentStatus) {
      query.paymentStatus =
        paymentStatus;
    }


    /* =================================================
       FILTER APPROVAL
    ================================================= */

    if (approval) {
      query.approval = approval;
    }


    /* =================================================
       FILTER EMPLOYEE
    ================================================= */

    if (employeeName) {
      query.employeeName =
        employeeName;
    }


    /* =================================================
       DATE FILTER
    ================================================= */

    if (fromDate || toDate) {

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


    /* =================================================
       PAGINATION
    ================================================= */

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


    /* =================================================
       DATABASE QUERY
    ================================================= */

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

      Expense.countDocuments(query),

    ]);


    /* =================================================
       RESPONSE
    ================================================= */

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

      message: error.message,
    });
  }
};


/* =====================================================
   GET SINGLE EXPENSE
===================================================== */

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

      message: error.message,
    });
  }
};


/* =====================================================
   UPDATE EXPENSE
===================================================== */

const updateExpense = async (
  req,
  res
) => {

  try {

    const expense =
      await Expense.findById(
        req.params.id
      );


    /* ---------------- NOT FOUND ---------------- */

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
    } = req.body;


    /* =================================================
       AMOUNT VALIDATION
    ================================================= */

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


    /* =================================================
       PAYMENT STATUS
    ================================================= */

    const finalPaymentStatus =
      paymentStatus ||
      expense.paymentStatus;


    const finalUpiNumber =
      upiNumber !== undefined
        ? upiNumber
        : expense.upiNumber;


    /* =================================================
       UPI VALIDATION
    ================================================= */

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


    /* =================================================
       SAVE OLD BILL
    ================================================= */

    const oldBill =
      expense.bill;


    /* =================================================
       UPDATE DATA
    ================================================= */

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


    /* =================================================
       NEW BILL
    ================================================= */

    if (req.file) {

      expense.bill =
        req.file.path;


      expense.billOriginalName =
        req.file.originalname;


      expense.billMimeType =
        req.file.mimetype;
    }


    /* =================================================
       SAVE
    ================================================= */

    await expense.save();


    /* =================================================
       DELETE OLD BILL
    ================================================= */

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


    /* Delete newly uploaded file */

    if (req.file?.path) {

      deleteImageFile(
        req.file.path
      );
    }


    return res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


/* =====================================================
   DELETE EXPENSE
===================================================== */

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


    /* Delete bill */

    if (expense.bill) {

      deleteImageFile(
        expense.bill
      );
    }


    /* Delete DB record */

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

      message: error.message,
    });
  }
};


/* =====================================================
   APPROVE EXPENSE
===================================================== */

const approveExpense = async (
  req,
  res
) => {

  try {

    const expense =
      await Expense.findByIdAndUpdate(

        req.params.id,

        {
          approval: "Approved",
        },

        {
          new: true,
          runValidators: true,
        }
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

      message: error.message,
    });
  }
};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

  createExpense,

  getExpenses,

  getExpenseById,

  updateExpense,

  deleteExpense,

  approveExpense,

};