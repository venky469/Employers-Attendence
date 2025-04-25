import express from "express"
import {
  getAttendances,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getLabourAttendanceSummary,
  getFarmerAttendanceSummary,
  getProjectAttendanceSummary,
} from "../controllers/attendanceController"
import { protect, authorize } from "../middleware/auth"
import { UserRole } from "../models/User"

const router = express.Router()

// Protect all routes
router.use(protect)

router.route("/").get(getAttendances).post(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), createAttendance)

router
  .route("/:id")
  .get(getAttendance)
  .put(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), updateAttendance)
  .delete(authorize(UserRole.TEAM_LEAD, UserRole.ADMIN), deleteAttendance)

router.get("/summary/labour/:labourId", getLabourAttendanceSummary)
router.get("/summary/farmer/:farmerId", getFarmerAttendanceSummary)
router.get("/summary/project/:projectId", getProjectAttendanceSummary)

export default router
