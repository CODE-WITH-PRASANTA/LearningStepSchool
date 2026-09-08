const mongoose = require("mongoose");

const FeeBalance = require("../../models/Fee/feeBalance.model");
const FeeEntry = require("../../models/Fee/feeEntry.model");
const Student = require("../../models/sudentAdmission.model");

/* =========================================================
   HELPERS
========================================================= */

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

/* =========================================================
   ACADEMIC YEAR HELPERS
=========================================================

   Supported:

   2025-2026
   2025-26

   Internal normalized format:

   2025-26
========================================================= */

const normalizeAcademicYear = (value) => {
  if (!value) {
    return "";
  }

  const year = String(value).trim();

  /*
    2025-2026
        ↓
    2025-26
  */

  const fullMatch = year.match(
    /^(\d{4})-(\d{4})$/
  );

  if (fullMatch) {
    return `${fullMatch[1]}-${fullMatch[2].slice(-2)}`;
  }

  return year;
};

/* =========================================================
   ACADEMIC YEAR VARIANTS
========================================================= */

const getAcademicYearVariants = (value) => {
  const normalized =
    normalizeAcademicYear(value);

  if (!normalized) {
    return [];
  }

  const match = normalized.match(
    /^(\d{4})-(\d{2})$/
  );

  if (!match) {
    return [normalized];
  }

  const startYear = Number(match[1]);

  const endYear = startYear + 1;

  return [
    normalized,
    `${startYear}-${endYear}`,
  ];
};

/* =========================================================
   PREVIOUS ACADEMIC YEAR
=========================================================

   2026-27
      ↓
   2025-26

   2027-28
      ↓
   2026-27
========================================================= */

const getPreviousAcademicYear = (
  academicYear
) => {
  const normalized =
    normalizeAcademicYear(
      academicYear
    );

  const match = normalized.match(
    /^(\d{4})-(\d{2})$/
  );

  if (!match) {
    return "";
  }

  const startYear = Number(
    match[1]
  );

  return `${startYear - 1}-${String(
    startYear
  ).slice(-2)}`;
};

/* =========================================================
   GET STRUCTURE TYPE
=========================================================

   New receipts:
      feeHead.structureType

   Old receipts:
      If installmentMonth exists → Monthly
      Otherwise → Annually
========================================================= */

const getStructureType = (
  feeHead,
  entry
) => {
  if (feeHead?.structureType) {
    return feeHead.structureType;
  }

  if (
    Array.isArray(
      entry.installmentMonth
    ) &&
    entry.installmentMonth.length
  ) {
    return "Monthly";
  }

  return "Annually";
};

/* =========================================================
   GET ORIGINAL FEE AMOUNT
========================================================= */

const getOriginalAmount = (
  feeHead,
  entry
) => {
  const snapshotAmount = Number(
    feeHead?.originalAmount || 0
  );

  if (snapshotAmount > 0) {
    return snapshotAmount;
  }

  return Number(
    entry.grossAmount || 0
  );
};

/* =========================================================
   CALCULATE LIABILITY

   This helper can still be used by other code.

   NOTE:

   This function calculates liability based on selected
   installments.

   Session closing DOES NOT use this for Monthly fees.

   Session closing uses the FULL originalAmount.
========================================================= */

const calculateLiability = ({
  structureType,
  originalAmount,
  months = [],
}) => {
  const amount = Number(
    originalAmount || 0
  );

  const uniqueMonths = [
    ...new Set(
      (
        Array.isArray(months)
          ? months
          : []
      )
        .map((month) =>
          normalizeValue(month)
        )
        .filter(Boolean)
    ),
  ];

  switch (structureType) {
    case "Monthly": {
      const monthlyAmount =
        amount / 12;

      return (
        monthlyAmount *
        uniqueMonths.length
      );
    }

    case "Quarterly": {
      const quarterlyAmount =
        amount / 4;

      const installmentCount =
        Math.ceil(
          uniqueMonths.length / 3
        );

      return (
        quarterlyAmount *
        installmentCount
      );
    }

    case "Half-Yearly": {
      const halfYearlyAmount =
        amount / 2;

      const installmentCount =
        Math.ceil(
          uniqueMonths.length / 6
        );

      return (
        halfYearlyAmount *
        installmentCount
      );
    }

    case "Annually":
    default:
      return amount;
  }
};

/* =========================================================
   CALCULATE APPLIED PAYMENT
=========================================================

   DO NOT use entry.paidAmount.

   Example:

   Fee = ₹1500
   Cash received = ₹3000

   Fee allocated = ₹1500
   Advance = ₹1500

   entry.paidAmount = ₹3000

   Actual fee payment = ₹1500

   Therefore:

   feeHead.amount
   +
   advanceAdjustment

========================================================= */

const calculateAppliedPayment = (
  entry,
  feeHead
) => {
  const allocatedAmount = Number(
    feeHead?.amount || 0
  );

  const advanceAdjustment =
    Number(
      entry.advanceAdjustment || 0
    );

  return (
    allocatedAmount +
    advanceAdjustment
  );
};

/* =========================================================
   CALCULATE SESSION BALANCE
=========================================================

   IMPORTANT FIX:

   For academic-session closing, Monthly Fee represents
   the FULL academic-year liability.

   Example:

   Monthly Fee:
      Original Amount = ₹3600
      Paid            = ₹600
      Due             = ₹3000

   Annual Fee:
      Original Amount = ₹4000
      Paid            = ₹2000
      Due             = ₹2000

   Total:
      Fee = ₹7600
      Paid = ₹2600
      Due = ₹5000

   We DO NOT do:

      ₹3600 / 12 × selected months

   for session closing.

========================================================= */

const calculateSessionBalance = async (
  studentId,
  academicYear
) => {
  /*
    ========================================================
    GET YEAR VARIANTS
    ========================================================
  */

  const academicYearVariants =
    getAcademicYearVariants(
      academicYear
    );

  if (
    academicYearVariants.length === 0
  ) {
    return {
      totalFee: 0,
      totalPaid: 0,
      totalDiscount: 0,
      closingDue: 0,
      receiptCount: 0,
    };
  }

  /*
    ========================================================
    GET ALL ACTIVE RECEIPTS
    ========================================================
  */

  const entries =
    await FeeEntry.find({
      studentId,

      academicYear: {
        $in: academicYearVariants,
      },

      isActive: true,
    }).sort({
      entryDate: 1,
      createdAt: 1,
    });

  /*
    ========================================================
    STORE ONE FEE HEAD PER SESSION
    ========================================================
  */

  const feeHeadsMap =
    new Map();

  /*
    ========================================================
    PROCESS RECEIPTS
    ========================================================
  */

  for (const entry of entries) {
    /*
      Old receipt compatibility.
    */

    const feeHeads =
      Array.isArray(
        entry.feeHeads
      ) &&
      entry.feeHeads.length
        ? entry.feeHeads
        : [
            {
              feeHeadId: null,

              feeHeadName: "Fee",

              originalAmount:
                Number(
                  entry.grossAmount ||
                    0
                ),

              amount: 0,

              structureType:
                Array.isArray(
                  entry.installmentMonth
                ) &&
                entry
                  .installmentMonth
                  .length
                  ? "Monthly"
                  : "Annually",
            },
          ];

    /*
      ======================================================
      PROCESS EACH FEE HEAD
      ======================================================
    */

    for (const feeHead of feeHeads) {
      /*
        Fee head identifier.

        Prefer ID because fee name can change.
      */

      const feeHeadKey =
        feeHead?.feeHeadId
          ?.toString() ||
        normalizeValue(
          feeHead?.feeHeadName
        ) ||
        "unknown-fee";

      /*
        Structure type.
      */

      const structureType =
        getStructureType(
          feeHead,
          entry
        );

      /*
        Original annual/session fee.
      */

      const originalAmount =
        getOriginalAmount(
          feeHead,
          entry
        );

      /*
        ====================================================
        ACTUAL PAYMENT APPLIED
        ====================================================

        DO NOT use entry.paidAmount.
      */

      const appliedPayment =
        calculateAppliedPayment(
          entry,
          feeHead
        );

      /*
        ====================================================
        CREATE FEE HEAD RECORD
        ====================================================
      */

      if (
        !feeHeadsMap.has(
          feeHeadKey
        )
      ) {
        feeHeadsMap.set(
          feeHeadKey,
          {
            feeHeadKey,

            feeHeadName:
              feeHead?.feeHeadName ||
              "Fee",

            structureType,

            originalAmount:
              Number(
                originalAmount || 0
              ),

            paid: 0,

            discount: 0,
          }
        );
      }

      const feeData =
        feeHeadsMap.get(
          feeHeadKey
        );

      /*
        ====================================================
        KEEP MAX ORIGINAL AMOUNT
        ====================================================

        Example:

        Receipt 1:
          MonthlyFee = 3600

        Receipt 2:
          MonthlyFee = 3600

        Result:

          MonthlyFee = 3600

        NOT:

          7200
      */

      feeData.originalAmount =
        Math.max(
          Number(
            feeData.originalAmount ||
              0
          ),

          Number(
            originalAmount || 0
          )
        );

      /*
        ====================================================
        ADD PAYMENT
        ====================================================
      */

      feeData.paid += Number(
        appliedPayment || 0
      );

      /*
        ====================================================
        ADD DISCOUNT
        ====================================================
      */

      feeData.discount += Number(
        entry.discountAmount || 0
      );
    }
  }

  /*
    ========================================================
    FINAL SESSION TOTALS
    ========================================================
  */

  let totalFee = 0;

  let totalPaid = 0;

  let totalDiscount = 0;

  /*
    ========================================================
    EACH FEE HEAD
    ========================================================
  */

  for (
    const feeData of
      feeHeadsMap.values()
  ) {
    /*
      FULL SESSION LIABILITY.

      Monthly:
        ₹3600 → ₹3600

      Quarterly:
        ₹4000 → ₹4000

      Half-Yearly:
        ₹6000 → ₹6000

      Annually:
        ₹4000 → ₹4000
    */

    totalFee += Number(
      feeData.originalAmount || 0
    );

    totalPaid += Number(
      feeData.paid || 0
    );

    totalDiscount += Number(
      feeData.discount || 0
    );
  }

  /*
    ========================================================
    DISCOUNT SAFETY
    ========================================================
  */

  totalDiscount = Math.min(
    totalDiscount,
    totalFee
  );

  /*
    ========================================================
    PAYABLE AFTER DISCOUNT
    ========================================================
  */

  const payableAfterDiscount =
    Math.max(
      0,
      totalFee -
        totalDiscount
    );

  /*
    ========================================================
    PAYMENT SAFETY
    ========================================================
  */

  totalPaid = Math.min(
    totalPaid,
    payableAfterDiscount
  );

  /*
    ========================================================
    FINAL CLOSING DUE
    ========================================================
  */

  const closingDue =
    Math.max(
      0,
      payableAfterDiscount -
        totalPaid
    );

  /*
    ========================================================
    RETURN
    ========================================================
  */

  return {
    totalFee: Number(
      totalFee.toFixed(2)
    ),

    totalPaid: Number(
      totalPaid.toFixed(2)
    ),

    totalDiscount: Number(
      totalDiscount.toFixed(2)
    ),

    closingDue: Number(
      closingDue.toFixed(2)
    ),

    receiptCount:
      entries.length,
  };
};

/* =========================================================
   CLOSE STUDENT ACADEMIC SESSION
=========================================================

   Used by:

   1. Close Academic Session API
   2. Student Promotion

   This creates/updates exactly one FeeBalance record.

   Old FeeEntry records are NOT modified.
========================================================= */

const closeStudentAcademicSession =
  async (
    studentId,
    academicYear
  ) => {
    /*
      ======================================================
      VALIDATION
      ======================================================
    */

    if (!studentId) {
      throw new Error(
        "studentId is required"
      );
    }

    if (!academicYear) {
      throw new Error(
        "academicYear is required"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      throw new Error(
        "Invalid studentId"
      );
    }

    /*
      ======================================================
      CHECK STUDENT
      ======================================================
    */

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {
      throw new Error(
        "Student not found"
      );
    }

    /*
      ======================================================
      NORMALIZE YEAR
      ======================================================

      2026-2027
          ↓
      2026-27
    */

    const normalizedAcademicYear =
      normalizeAcademicYear(
        academicYear
      );

    if (
      !normalizedAcademicYear
    ) {
      throw new Error(
        "Invalid academicYear"
      );
    }

    /*
      ======================================================
      CALCULATE FINAL BALANCE
      ======================================================
    */

    const balance =
      await calculateSessionBalance(
        studentId,
        normalizedAcademicYear
      );

    /*
      ======================================================
      SAVE FEE BALANCE
      ======================================================

      If record already exists:
        UPDATE

      Otherwise:
        CREATE
    */

    const feeBalance =
      await FeeBalance.findOneAndUpdate(
        {
          studentId,

          academicYear:
            normalizedAcademicYear,
        },

        {
          $set: {
            studentId,

            academicYear:
              normalizedAcademicYear,

            totalFee:
              balance.totalFee,

            totalPaid:
              balance.totalPaid,

            totalDiscount:
              balance.totalDiscount,

            closingDue:
              balance.closingDue,

            isClosed: true,

            closedAt: new Date(),

            isActive: true,
          },
        },

        {
          new: true,

          upsert: true,

          setDefaultsOnInsert: true,
        }
      );

    /*
      ======================================================
      RETURN
      ======================================================
    */

    return {
      _id: feeBalance._id,

      studentId:
        feeBalance.studentId,

      academicYear:
        feeBalance.academicYear,

      totalFee:
        feeBalance.totalFee,

      totalPaid:
        feeBalance.totalPaid,

      totalDiscount:
        feeBalance.totalDiscount,

      closingDue:
        feeBalance.closingDue,

      isClosed:
        feeBalance.isClosed,

      closedAt:
        feeBalance.closedAt,

      receiptCount:
        balance.receiptCount,
    };
  };

/* =========================================================
   CLOSE ACADEMIC SESSION API
========================================================= */

const closeAcademicSession =
  async (req, res) => {
    try {
      const {
        studentId,
        academicYear,
      } = req.body;

      /*
        ======================================================
        VALIDATION
        ======================================================
      */

      if (
        !studentId ||
        !academicYear
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "studentId and academicYear are required",
          });
      }

      /*
        ======================================================
        CLOSE SESSION
        ======================================================
      */

      const data =
        await closeStudentAcademicSession(
          studentId,
          academicYear
        );

      /*
        ======================================================
        RESPONSE
        ======================================================
      */

      return res
        .status(200)
        .json({
          success: true,

          message: `${normalizeAcademicYear(
            academicYear
          )} session closed successfully`,

          data,
        });
    } catch (error) {
      console.error(
        "Close Academic Session Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to close academic session",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   GET CARRY FORWARD
=========================================================

   IMPORTANT FIX:

   Current session:
      2026-27

   We ONLY search:
      2025-26

   We do NOT add:

      2024-25
      2023-24
      etc.

   This prevents old historical dues from being repeatedly
   added to the current previous-session due.
========================================================= */

const getCarryForward =
  async (req, res) => {
    try {
      const {
        studentId,
        academicYear,
      } = req.params;

      /*
        ======================================================
        VALIDATION
        ======================================================
      */

      if (
        !studentId ||
        !academicYear
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "studentId and academicYear are required",
          });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          studentId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid studentId",
          });
      }

      /*
        ======================================================
        CURRENT ACADEMIC YEAR
        ======================================================
      */

      const currentAcademicYear =
        normalizeAcademicYear(
          academicYear
        );

      /*
        ======================================================
        PREVIOUS ACADEMIC YEAR
        ======================================================

        2026-27
            ↓
        2025-26
      */

      const previousAcademicYear =
        getPreviousAcademicYear(
          currentAcademicYear
        );

      /*
        If academic year cannot be calculated,
        return zero.
      */

      if (
        !previousAcademicYear
      ) {
        return res
          .status(200)
          .json({
            success: true,

            studentId,

            academicYear:
              currentAcademicYear,

            previousAcademicYear:
              "",

            carryForwardDue: 0,

            breakdown: [],
          });
      }

      /*
        ======================================================
        PREVIOUS YEAR VARIANTS
        ======================================================

        2025-26
        2025-2026
      */

      const previousYearVariants =
        getAcademicYearVariants(
          previousAcademicYear
        );

      /*
        ======================================================
        FIND ONLY PREVIOUS SESSION
        ======================================================
      */

      const previousBalance =
        await FeeBalance.findOne({
          studentId,

          academicYear: {
            $in:
              previousYearVariants,
          },

          isActive: true,

          isClosed: true,

          closingDue: {
            $gt: 0,
          },
        }).sort({
          closedAt: -1,
        });

      /*
        ======================================================
        GET DUE
        ======================================================
      */

      const carryForwardDue =
        Number(
          previousBalance?.closingDue ||
            0
        );

      /*
        ======================================================
        BREAKDOWN
        ======================================================
      */

      const breakdown =
        previousBalance
          ? [
              {
                academicYear:
                  previousBalance.academicYear,

                due: Number(
                  previousBalance.closingDue ||
                    0
                ),
              },
            ]
          : [];

      /*
        ======================================================
        RESPONSE
        ======================================================
      */

      return res
        .status(200)
        .json({
          success: true,

          studentId,

          academicYear:
            currentAcademicYear,

          previousAcademicYear,

          carryForwardDue:
            Number(
              carryForwardDue.toFixed(
                2
              )
            ),

          breakdown,
        });
    } catch (error) {
      console.error(
        "Get Carry Forward Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to get carry forward",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  calculateSessionBalance,

  closeStudentAcademicSession,

  closeAcademicSession,

  getCarryForward,
};