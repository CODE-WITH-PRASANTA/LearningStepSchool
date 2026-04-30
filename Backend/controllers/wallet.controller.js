const Wallet = require("../models/walletTransaction.model");

/* ================= WALLET HISTORY ================= */
exports.getWalletHistory = async (req, res) => {
  try {
    const { type, source, from, to } = req.query;

    let filter = {};

    if (type) filter.type = type; // credit / debit
    if (source) filter.source = source; // fee / expense

    // 📅 Date filter
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(`${to}T23:59:59.999`);
    }

    const transactions = await Wallet.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= WALLET SUMMARY ================= */
exports.getWalletSummary = async (req, res) => {
  try {
    const result = await Wallet.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let credit = 0;
    let debit = 0;

    result.forEach((item) => {
      if (item._id === "credit") credit = item.total;
      if (item._id === "debit") debit = item.total;
    });

    res.json({
      success: true,
      credit,
      debit,
      balance: credit - debit,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= MONTHLY REPORT ================= */
exports.getMonthlyReport = async (req, res) => {
  try {
    const data = await Wallet.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET SINGLE TRANSACTION ================= */
exports.getTransactionById = async (req, res) => {
  try {
    const tx = await Wallet.findById(req.params.id);

    if (!tx) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: tx,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
