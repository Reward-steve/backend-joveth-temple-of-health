const { AppError } = require("../Utils/reusableFunctions");
const roles = require("../config/roles");

exports.restrict = (...allowedRoles) => {
  return async (req, res, next) => {
    // Ensure user exists
    if (!req.user) {
      return next(new AppError("Unauthorized: User not found", 401));
    }

    // Ensure user has a role
    if (!req.user.role) {
      return next(new AppError("Access Denied: Role not found", 403));
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Access Denied: You are not authorized", 403));
    }

    next(); // Proceed if authorized
  };
};

exports.authorize = (requiredPermissions) => {
  return (req, res, next) => {
    // Ensure user exists and has a role
    if (!req.user) {
      return next(new AppError("Unauthorized: User not found", 401));
    }

    // Ensure user has an admin role (if required)
    if (!req.user.adminRole) {
      return next(new AppError("Access Denied: You are not an admin", 403));
    }

    const userRole = req.user.adminRole;
    const userPermissions = roles[userRole];

    // Ensure userPermissions is valid before checking
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return next(new AppError("Access Denied: Invalid role permissions", 403));
    }

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new AppError("Access Denied: You lack required permissions", 403)
      );
    }

    next(); // Proceed if authorized
  };
};
