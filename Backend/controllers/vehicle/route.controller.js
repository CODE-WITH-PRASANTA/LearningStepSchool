const Route = require(
    "../../models/Vehicle/route.model")
  
  /* CREATE ROUTE */
  
  exports.createRoute = async (
    req,
    res
  ) => {
    try {
      const route =
        await Route.create({
          routeName:
            req.body.routeName,
        });
  
      res.status(201).json({
        success: true,
        message:
          "Route added successfully",
        data: route,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  /* GET ALL ROUTES */
  
  exports.getRoutes = async (
    req,
    res
  ) => {
    try {
      const search =
        req.query.search || "";
  
      const routes =
        await Route.find({
          routeName: {
            $regex: search,
            $options: "i",
          },
        }).sort({
          createdAt: -1,
        });
  
      res.status(200).json({
        success: true,
        data: routes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  /* GET SINGLE ROUTE */
  
  exports.getRouteById =
    async (req, res) => {
      try {
        const route =
          await Route.findById(
            req.params.id
          );
  
        if (!route) {
          return res.status(404).json({
            success: false,
            message:
              "Route not found",
          });
        }
  
        res.status(200).json({
          success: true,
          data: route,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };
  
  /* UPDATE ROUTE */
  
  exports.updateRoute =async (req, res) => {
      try {
        const route =
          await Route.findByIdAndUpdate(
            req.params.id,
            {
              routeName:
                req.body.routeName,
            },
            {
              new: true,
            }
          );
  
        res.status(200).json({
          success: true,
          message:
            "Route updated successfully",
          data: route,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };
  
  /* DELETE ROUTE */
  
  exports.deleteRoute = async (req, res) => {
      try {
        await Route.findByIdAndDelete(
          req.params.id
        );
  
        res.status(200).json({
          success: true,
          message:
            "Route deleted successfully",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };