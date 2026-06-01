const AssignRoute = require("../../models/Vehicle/assignRoute.model");

const populateAssignRoute = (query) =>
  query
    .populate("routeId", "routeName")
    .populate(
      "destinations.destinationId",
      "destination fare distance routeId"
    );

/* CREATE */

exports.createAssignRoute = async (req, res) => {
  try {
    const { routeId, destinationIds = [] } = req.body;

    if (!routeId || destinationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Route and destinations are required",
      });
    }

    const assignRoute = await AssignRoute.create({
      routeId,
      destinations: destinationIds.map(
        (destinationId) => ({
          destinationId,
        })
      ),
    });

    const data = await populateAssignRoute(
      AssignRoute.findById(assignRoute._id)
    );

    return res.status(201).json({
      success: true,
      message:
        "Route assigned successfully",
      data,
    });
  } catch (error) {
    const status =
      error.code === 11000 ? 409 : 500;

    return res.status(status).json({
      success: false,
      message:
        error.code === 11000
          ? "This route is already assigned"
          : error.message,
    });
  }
};

/* GET ALL */

exports.getAssignRoutes = async (req, res) => {
  try {
    const search = req.query.search || "";

    const data = await populateAssignRoute(
      AssignRoute.find().sort({
        createdAt: -1,
      })
    );

    const filteredData = search
      ? data.filter((item) =>
          item.routeId?.routeName
            ?.toLowerCase()
            .includes(search.toLowerCase())
        )
      : data;

    return res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE */

exports.updateAssignRoute = async (req, res) => {
  try {
    const { routeId, destinationIds = [] } = req.body;

    if (!routeId || destinationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Route and destinations are required",
      });
    }

    const assignRoute =
      await AssignRoute.findByIdAndUpdate(
        req.params.id,
        {
          routeId,
          destinations: destinationIds.map(
            (destinationId) => ({
              destinationId,
            })
          ),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!assignRoute) {
      return res.status(404).json({
        success: false,
        message:
          "Assigned route not found",
      });
    }

    const data = await populateAssignRoute(
      AssignRoute.findById(assignRoute._id)
    );

    return res.status(200).json({
      success: true,
      message:
        "Assigned route updated successfully",
      data,
    });
  } catch (error) {
    const status =
      error.code === 11000 ? 409 : 500;

    return res.status(status).json({
      success: false,
      message:
        error.code === 11000
          ? "This route is already assigned"
          : error.message,
    });
  }
};

/* DELETE */

exports.deleteAssignRoute = async (req, res) => {
  try {
    const assignRoute =
      await AssignRoute.findByIdAndDelete(
        req.params.id
      );

    if (!assignRoute) {
      return res.status(404).json({
        success: false,
        message:
          "Assigned route not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Assigned route deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
