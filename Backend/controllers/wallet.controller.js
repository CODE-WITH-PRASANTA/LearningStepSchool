const mongoose = require("mongoose");

const Wallet = require("../models/walletTransaction.model");


/* =========================================================
   VALIDATION HELPERS
========================================================= */

const VALID_TYPES = [
  "credit",
  "debit",
];

const VALID_SOURCES = [
  "fee",
  "expense",
  "payroll",
  "fuel",
  "otherIncome",
];


/* =========================================================
   CREATE TRANSACTION
========================================================= */

exports.createTransaction = async (
  req,
  res
) => {
  try {

    const {
      type,
      amount,
      source,
      referenceId,
      description,
      createdBy,
    } = req.body;


    /* =====================================================
       TYPE VALIDATION
    ===================================================== */

    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction type is required",
      });
    }


    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid transaction type",
      });
    }


    /* =====================================================
       AMOUNT VALIDATION
    ===================================================== */

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount is required",
      });
    }


    const numericAmount =
      Number(amount);


    if (
      Number.isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be a valid positive number",
      });
    }


    /* =====================================================
       SOURCE VALIDATION
    ===================================================== */

    if (!source) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction source is required",
      });
    }


    if (!VALID_SOURCES.includes(source)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid transaction source",
      });
    }


    /* =====================================================
       REFERENCE ID VALIDATION
    ===================================================== */

    if (!referenceId) {
      return res.status(400).json({
        success: false,
        message:
          "Reference ID is required",
      });
    }


    if (
      !mongoose.Types.ObjectId.isValid(
        referenceId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reference ID",
      });
    }


    /* =====================================================
       DUPLICATE CHECK
    ===================================================== */

    const existingTransaction =
      await Wallet.findOne({
        source,
        referenceId,
      });


    if (existingTransaction) {
      return res.status(409).json({
        success: false,

        message:
          "Wallet transaction already exists for this reference",

        data:
          existingTransaction,
      });
    }


    /* =====================================================
       CREATE
    ===================================================== */

    const transaction =
      await Wallet.create({
        type,

        amount:
          numericAmount,

        source,

        referenceId,

        description:
          description || "",

        createdBy:
          createdBy || "Admin",
      });


    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({

      success: true,

      message:
        "Wallet transaction created successfully",

      data:
        transaction,
    });

  } catch (err) {

    console.error(
      "CREATE WALLET TRANSACTION ERROR:",
      err
    );


    /*
      Mongo duplicate key
    */

    if (err.code === 11000) {

      return res.status(409).json({

        success: false,

        message:
          "Wallet transaction already exists for this reference",
      });
    }


    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};


/* =========================================================
   WALLET HISTORY
========================================================= */

exports.getWalletHistory = async (
  req,
  res
) => {
  try {

    const {
      type,
      source,
      from,
      to,
    } = req.query;


    const filter = {};


    /* =====================================================
       TYPE FILTER
    ===================================================== */

    if (type) {

      if (
        !VALID_TYPES.includes(type)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid transaction type",
        });
      }

      filter.type = type;
    }


    /* =====================================================
       SOURCE FILTER
    ===================================================== */

    if (source) {

      if (
        !VALID_SOURCES.includes(source)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid transaction source",
        });
      }

      filter.source = source;
    }


    /* =====================================================
       DATE FILTER
    ===================================================== */

    if (from || to) {

      filter.createdAt = {};


      if (from) {

        const fromDate =
          new Date(
            `${from}T00:00:00.000`
          );


        if (
          Number.isNaN(
            fromDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid from date",
          });
        }


        filter.createdAt.$gte =
          fromDate;
      }


      if (to) {

        const toDate =
          new Date(
            `${to}T23:59:59.999`
          );


        if (
          Number.isNaN(
            toDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid to date",
          });
        }


        filter.createdAt.$lte =
          toDate;
      }
    }


    /* =====================================================
       QUERY
    ===================================================== */

    const transactions =
      await Wallet.find(filter)
        .sort({
          createdAt: -1,
        });


    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.json({

      success: true,

      count:
        transactions.length,

      data:
        transactions,
    });

  } catch (err) {

    console.error(
      "GET WALLET HISTORY ERROR:",
      err
    );


    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};


/* =========================================================
   WALLET SUMMARY
========================================================= */

exports.getWalletSummary = async (
  req,
  res
) => {
  try {

    const result =
      await Wallet.aggregate([

        {
          $group: {

            _id: "$type",

            total: {
              $sum: "$amount",
            },
          },
        },

      ]);


    let credit = 0;

    let debit = 0;


    result.forEach(
      (item) => {

        if (
          item._id ===
          "credit"
        ) {
          credit =
            item.total;
        }


        if (
          item._id ===
          "debit"
        ) {
          debit =
            item.total;
        }

      }
    );


    /* =====================================================
       BALANCE
    ===================================================== */

    const balance =
      credit - debit;


    return res.json({

      success: true,

      credit,

      debit,

      balance,
    });

  } catch (err) {

    console.error(
      "GET WALLET SUMMARY ERROR:",
      err
    );


    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};


/* =========================================================
   SOURCE SUMMARY
========================================================= */

exports.getWalletSourceSummary =
  async (
    req,
    res
  ) => {

    try {

      const result =
        await Wallet.aggregate([

          {
            $group: {

              _id: {
                type: "$type",
                source: "$source",
              },

              total: {
                $sum: "$amount",
              },
            },
          },

          {
            $sort: {
              "_id.type": 1,
              "_id.source": 1,
            },
          },

        ]);


      return res.json({

        success: true,

        data:
          result,
      });

    } catch (err) {

      console.error(
        "GET WALLET SOURCE SUMMARY ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  };


/* =========================================================
   MONTHLY REPORT
========================================================= */

exports.getMonthlyReport = async (
  req,
  res
) => {
  try {

    const data =
      await Wallet.aggregate([

        {
          $group: {

            _id: {

              year: {
                $year:
                  "$createdAt",
              },

              month: {
                $month:
                  "$createdAt",
              },

              type:
                "$type",
            },

            total: {
              $sum:
                "$amount",
            },
          },
        },


        {
          $sort: {

            "_id.year": -1,

            "_id.month": -1,

          },
        },

      ]);


    return res.json({

      success: true,

      data,
    });

  } catch (err) {

    console.error(
      "GET MONTHLY WALLET REPORT ERROR:",
      err
    );


    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};


/* =========================================================
   MONTHLY SOURCE REPORT
========================================================= */

exports.getMonthlySourceReport =
  async (
    req,
    res
  ) => {

    try {

      const data =
        await Wallet.aggregate([

          {
            $group: {

              _id: {

                year: {
                  $year:
                    "$createdAt",
                },

                month: {
                  $month:
                    "$createdAt",
                },

                type:
                  "$type",

                source:
                  "$source",
              },

              total: {
                $sum:
                  "$amount",
              },
            },
          },


          {
            $sort: {

              "_id.year": -1,

              "_id.month": -1,

            },
          },

        ]);


      return res.json({

        success: true,

        data,
      });

    } catch (err) {

      console.error(
        "GET MONTHLY SOURCE REPORT ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  };


/* =========================================================
   GET SINGLE TRANSACTION
========================================================= */

exports.getTransactionById =
  async (
    req,
    res
  ) => {

    try {

      const tx =
        await Wallet.findById(
          req.params.id
        );


      if (!tx) {

        return res.status(404).json({

          success: false,

          message:
            "Transaction not found",
        });
      }


      return res.json({

        success: true,

        data:
          tx,
      });

    } catch (err) {

      console.error(
        "GET WALLET TRANSACTION ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  };


/* =========================================================
   DELETE TRANSACTION
========================================================= */

exports.deleteTransaction =
  async (
    req,
    res
  ) => {

    try {

      const transaction =
        await Wallet.findByIdAndDelete(
          req.params.id
        );


      if (!transaction) {

        return res.status(404).json({

          success: false,

          message:
            "Transaction not found",
        });
      }


      return res.json({

        success: true,

        message:
          "Wallet transaction deleted successfully",

        data:
          transaction,
      });

    } catch (err) {

      console.error(
        "DELETE WALLET TRANSACTION ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  };