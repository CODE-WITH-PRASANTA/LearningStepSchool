const VehicleRoute = require("../../models/Vehicle/vehicleRoute.model");

const populateVehicleRoute = (query) =>
  query
    .populate(
      "vehicleId",
      "vehicleType vehicleNo capacity driver"
    )
    .populate("routes.routeId", "routeName");

/* CREATE */

exports.createVehicleRoute = async (req, res) => {
  try {
    const { vehicleId, routeIds = [] } =
      req.body;

    if (!vehicleId || routeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle and routes are required",
      });
    }

    const vehicleRoute =
      await VehicleRoute.create({
        vehicleId,
        routes: routeIds.map(
          (routeId) => ({
            routeId,
          })
        ),
      });

    const data = await populateVehicleRoute(
      VehicleRoute.findById(
        vehicleRoute._id
      )
    );

    return res.status(201).json({
      success: true,
      message:
        "Vehicle route assigned successfully",
      data,
    });
  } catch (error) {
    const status =
      error.code === 11000 ? 409 : 500;

    return res.status(status).json({
      success: false,
      message:
        error.code === 11000
          ? "This vehicle is already assigned"
          : error.message,
    });
  }
};

/* GET ALL */

exports.getVehicleRoutes = async (req, res) => {
  try {
    const search = req.query.search || "";

    const data = await populateVehicleRoute(
      VehicleRoute.find().sort({
        createdAt: -1,
      })
    );

    const filteredData = search
      ? data.filter((item) => {
          const vehicle =
            item.vehicleId || {};

          const routes =
            item.routes
              ?.map(
                (route) =>
                  route.routeId
                    ?.routeName
              )
              .join(" ") || "";

          return [
            vehicle.vehicleType,
            vehicle.vehicleNo,
            vehicle.driver,
            vehicle.capacity,
            routes,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );
        })
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

exports.updateVehicleRoute = async (req, res) => {
  try {
    const { vehicleId, routeIds = [] } =
      req.body;

    if (!vehicleId || routeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle and routes are required",
      });
    }

    const vehicleRoute =
      await VehicleRoute.findByIdAndUpdate(
        req.params.id,
        {
          vehicleId,
          routes: routeIds.map(
            (routeId) => ({
              routeId,
            })
          ),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!vehicleRoute) {
      return res.status(404).json({
        success: false,
        message:
          "Vehicle route assignment not found",
      });
    }

    const data = await populateVehicleRoute(
      VehicleRoute.findById(
        vehicleRoute._id
      )
    );

    return res.status(200).json({
      success: true,
      message:
        "Vehicle route assignment updated successfully",
      data,
    });
  } catch (error) {
    const status =
      error.code === 11000 ? 409 : 500;

    return res.status(status).json({
      success: false,
      message:
        error.code === 11000
          ? "This vehicle is already assigned"
          : error.message,
    });
  }
};

/* DELETE */

exports.deleteVehicleRoute = async (req, res) => {
  try {
    const vehicleRoute =
      await VehicleRoute.findByIdAndDelete(
        req.params.id
      );

    if (!vehicleRoute) {
      return res.status(404).json({
        success: false,
        message:
          "Vehicle route assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Vehicle route assignment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
