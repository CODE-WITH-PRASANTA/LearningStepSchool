const OtherIncome = require("../models/otherIncome.model");
const Wallet = require("../models/walletTransaction.model");

const buildWalletDescription = (income) =>
  `${income.incomeHead} from ${income.receivedFrom}`;

// CREATE
exports.createIncome = async (req, res) => {
  try {
    const income = await OtherIncome.create(req.body);

    const walletTx = await Wallet.create({
      type: "credit",
      amount: income.amount,
      source: "otherIncome",
      referenceId: income._id,
      description: buildWalletDescription(income),
    });

    income.walletLinked = true;
    income.walletTransactionId = walletTx._id;
    await income.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully and credited to wallet",
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL
exports.getAllIncome = async (req, res) => {
  try {
    const income = await OtherIncome.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: income.length,
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ONE
exports.getIncomeById = async (req, res) => {
  try {
    const income = await OtherIncome.findById(
      req.params.id
    );

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE
exports.updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;

    const income = await OtherIncome.findByIdAndUpdate(
      incomeId,
      req.body,
      { new: true }
    );

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    let walletTx = await Wallet.findOne({
      referenceId: incomeId,
      source: "otherIncome",
    });

    if (walletTx) {
      walletTx.amount = income.amount;
      walletTx.description = buildWalletDescription(income);
      walletTx.updatedAt = new Date();
      await walletTx.save();
    } else {
      walletTx = await Wallet.create({
        type: "credit",
        amount: income.amount,
        source: "otherIncome",
        referenceId: income._id,
        description: buildWalletDescription(income),
      });

      income.walletLinked = true;
      income.walletTransactionId = walletTx._id;
      await income.save();
    }

    res.status(200).json({
      success: true,
      message: "Income updated",
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE
exports.deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;

    const income = await OtherIncome.findById(incomeId);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    await Wallet.deleteOne({
      referenceId: incomeId,
      source: "otherIncome",
    });
    await OtherIncome.findByIdAndDelete(incomeId);

    res.status(200).json({
      success: true,
      message: "Income deleted and removed from wallet",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.monthlyIncomeReport = async (req, res) => {
  try {
    const report = await OtherIncome.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: {
            $sum: "$amount",
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

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.yearlyIncomeReport = async (req, res) => {
  try {
    const report = await OtherIncome.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
          },
          totalIncome: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
