const Destination = require("../../models/Vehicle/destination.model");

/* CREATE */

exports.createDestination = async (req, res) => {
  try {
    console.log("REQ BODY =>", req.body);

    const destination = await Destination.create({
      routeId: req.body.routeId,
      destination: req.body.destination,
      distance: req.body.distance,
      fare: req.body.fare,
    });

    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.log("CREATE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL */

exports.getDestinations = async (req, res) => {
  try {
    const search = req.query.search || "";

    const data = await Destination.find({
      destination: {
        $regex: search,
        $options: "i",
      },
    })
      .populate("routeId", "routeName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE */

exports.updateDestination = async (req, res) => {
  try {
    const data = await Destination.findByIdAndUpdate(
      req.params.id,
      {
        routeId: req.body.routeId,
        destination: req.body.destination,
        distance: req.body.distance,
        fare: req.body.fare,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* DELETE */

exports.deleteDestination = async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};