module.exports = (permission) => {
  return (req, res, next) => {

    // console.log("USER:", req.user);

    // ✅ admin bypass
    if (req.user.role === "admin") return next();

    // ✅ ALL permission
    if (req.user.permissions?.includes("ALL")) return next();

    // ❌ no permissions
    if (!req.user.permissions) {
      return res.status(403).json({ message: "No permissions assigned" });
    }

    // ❌ specific check
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};