const StudentGatePass = require("../models/studentGatePass.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */

exports.createGatePass = async (req, res) => {
  try {
    const {
      studentId,
      visitorName,
      relation,
      phone,
      timeIn,
      timeOut,
      reason,
      remark,
    } = req.body;

    const photo =
      req.body.photo?.[0] ||
      req.body.photo ||
      "";

    const count = await StudentGatePass.countDocuments();

    const gatePass = await StudentGatePass.create({
      gatePassNo: `GP${String(count + 1).padStart(5, "0")}`,
      studentId,
      visitorName,
      relation,
      phone,
      timeIn,
      timeOut,
      reason,
      remark,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "Gate Pass Created Successfully",
      data: gatePass,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */

exports.getAllGatePasses = async (req, res) => {
  try {
    const data = await StudentGatePass.find().populate("studentId");

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("GET ALL GATE PASS ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllGatePass = exports.getAllGatePasses;

/* ================= GET SINGLE ================= */

exports.getGatePassById = async (req, res) => {
  try {
    const gatePass = await StudentGatePass.findById(
      req.params.id
    ).populate("studentId");

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Gate Pass Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: gatePass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */

exports.updateGatePass = async (req, res) => {
  try {
    const gatePass = await StudentGatePass.findById(
      req.params.id
    );

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Gate Pass Not Found",
      });
    }

    let photo = gatePass.photo;

    if (req.body.photo) {
      deleteImageFile(gatePass.photo);

      photo =
        req.body.photo?.[0] ||
        req.body.photo;
    }

    const updated = await StudentGatePass.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        photo,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Gate Pass Updated Successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */

exports.deleteGatePass = async (req, res) => {
  try {
    const gatePass = await StudentGatePass.findById(
      req.params.id
    );

    if (!gatePass) {
      return res.status(404).json({
        success: false,
        message: "Gate Pass Not Found",
      });
    }

    if (gatePass.photo) {
      deleteImageFile(gatePass.photo);
    }

    await gatePass.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gate Pass Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= STUDENT WISE ================= */

exports.getStudentGatePasses = async (req, res) => {
  try {
    const data = await StudentGatePass.find({
      studentId: req.params.studentId,
    })
      .populate("studentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};