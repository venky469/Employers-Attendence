import express from "express"
import { getLabours, getLabour, createLabour, updateLabour, deleteLabour } from "../controllers/labourController"
import { protect, authorize } from "../middleware/auth"
import { UserRole } from "../models/User"

const router = express.Router()

// Protect all routes
router.use(protect)

// Get all labours and get single labour
router.route("/").get(getLabours).post(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), createLabour)

router
  .route("/:id")
  .get(getLabour)
  .put(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), updateLabour)
  .delete(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), deleteLabour)

export default router
