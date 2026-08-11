const Holiday = require("../models/holiday.model");

const toUtcDay = (date) => {
  const value = new Date(date);

  return new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    )
  );
};

// =====================================================
// CREATE HOLIDAY
// =====================================================

exports.createHoliday = async (req, res) => {
  try {
    const {
      name,
      date,
      description,
      type,
      isPaid,
    } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        success: false,
        message: "Holiday name and date are required",
      });
    }

    const holidayDate = toUtcDay(date);

    const exists = await Holiday.findOne({
      date: holidayDate,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists for this date",
      });
    }

    const holiday = await Holiday.create({
      name,
      date: holidayDate,
      description: description || "",
      type: type || "Public Holiday",
      isPaid: isPaid !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Holiday added successfully",
      data: holiday,
    });
  } catch (error) {
    console.error("CREATE HOLIDAY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL HOLIDAYS
// =====================================================

exports.getHolidays = async (req, res) => {
  try {
    const { year, month } = req.query;

    const filter = {};

    if (year) {
      const selectedYear = Number(year);

      const start = new Date(
        Date.UTC(selectedYear, 0, 1)
      );

      const end = new Date(
        Date.UTC(
          selectedYear + 1,
          0,
          1
        )
      );

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    if (month && year) {
      const selectedYear = Number(year);
      const selectedMonth = Number(month);

      const start = new Date(
        Date.UTC(
          selectedYear,
          selectedMonth - 1,
          1
        )
      );

      const end = new Date(
        Date.UTC(
          selectedYear,
          selectedMonth,
          1
        )
      );

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const holidays = await Holiday.find(filter).sort({
      date: 1,
    });

    return res.json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    console.error("GET HOLIDAYS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET HOLIDAY BY ID
// =====================================================

exports.getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(
      req.params.id
    );

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    return res.json({
      success: true,
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE HOLIDAY
// =====================================================

exports.updateHoliday = async (req, res) => {
  try {
    const {
      name,
      date,
      description,
      type,
      isPaid,
    } = req.body;

    const holiday = await Holiday.findById(
      req.params.id
    );

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    if (name !== undefined) {
      holiday.name = name;
    }

    if (date !== undefined) {
      const newDate = toUtcDay(date);

      const duplicate = await Holiday.findOne({
        date: newDate,
        _id: {
          $ne: holiday._id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another holiday already exists for this date",
        });
      }

      holiday.date = newDate;
    }

    if (description !== undefined) {
      holiday.description = description;
    }

    if (type !== undefined) {
      holiday.type = type;
    }

    if (isPaid !== undefined) {
      holiday.isPaid =
        isPaid === true ||
        isPaid === "true";
    }

    await holiday.save();

    return res.json({
      success: true,
      message: "Holiday updated successfully",
      data: holiday,
    });
  } catch (error) {
    console.error("UPDATE HOLIDAY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE HOLIDAY
// =====================================================

exports.deleteHoliday = async (req, res) => {
  try {
    const holiday =
      await Holiday.findByIdAndDelete(
        req.params.id
      );

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    return res.json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    console.error("DELETE HOLIDAY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};