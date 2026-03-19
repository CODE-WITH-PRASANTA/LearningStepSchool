const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    admissionNo: String,
    class: String,
    section: String,
    rollNumber: String,
    biometricId: String,
    admissionDate: Date,

    firstName: String,
    lastName: String,
    gender: String,
    dob: Date,

    category: String,
    religion: String,
    caste: String,

    mobile: String,
    email: String,
    bloodGroup: String,

    house: String,
    sponsor: String,

    height: String,
    weight: String,
    aadharNumber: String,

    pen: String,
    srNo: String,
    apaarId: String,

    studentBehaviour: [String],

    marriageAnniversary: Date,
    guardianType: String,

    /* PHOTOS */
    studentPhoto: String,
    fatherPhoto: String,
    motherPhoto: String,
    guardianPhoto: String,

    /* FATHER */
    fatherName: String,
    fatherPhone: String,
    fatherDob: Date,
    fatherOccupation: String,

    /* MOTHER */
    motherName: String,
    motherPhone: String,
    motherDob: Date,
    motherOccupation: String,

    /* GUARDIAN */
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String,
    guardianEmail: String,
    guardianOccupation: String,
    guardianAddress: String,

    /* ADDRESS */
    guardianAddressSame: Boolean,
    permanentAddressSame: Boolean,
    currentAddress: String,
    permanentAddress: String,

    /* FEES */
    feeGroup: String,
    discountList: String,
    discountMonth: String,

    /* TRANSPORT */
    routeList: String,
    busStop: String,

    /* HOSTEL */
    hostelType: String,
    hostelName: String,
    roomType: String,
    room: String,

    /* BANK */
    bankAccountNumber: String,
    bankName: String,
    branchCode: String,

    /* MISC */
    previousSchoolDetails: String,
    note: String,

    /* DOCUMENTS */
    documents: {
      reportCard: String,
      tc: String,
      samagraId: String,
      nidaCard: String,
      previousMarksheet: String,
      dobCertificate: String,
      aadhaarStudent: String,
      aadhaarParent: String,
      incomeCertificate: String,
      pip: String,
    },
  },
  { timestamps: true },
);

studentSchema.set("toJSON", {
  transform: (doc, ret) => {
    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
    };

    ret.admissionDate = formatDate(ret.admissionDate);
    ret.dob = formatDate(ret.dob);
    ret.fatherDob = formatDate(ret.fatherDob);
    ret.motherDob = formatDate(ret.motherDob);
    ret.marriageAnniversary = formatDate(ret.marriageAnniversary);

    return ret;
  },
});

module.exports = mongoose.model("Student", studentSchema);
