import { ApiError } from "../utils/apiError.js";

// Dedicated admin gate used after `protect` has attached req.user.
export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  next();
};
