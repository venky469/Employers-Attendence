import express from "express"
import {
  getFarmers,
  getFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  assignTeamLead,
  removeTeamLead,
} from "../controllers/farmerController"
import { protect, authorize } from "../middleware/auth"
import { UserRole } from "../models/User"

const router = express.Router()

// Protect all routes
router.use(protect)

// Get all farmers and get single farmer
router.route("/").get(getFarmers).post(createFarmer)

router.route("/:id").get(getFarmer).put(updateFarmer).delete(authorize(UserRole.ADMIN), deleteFarmer)

router.put("/:id/assign-team-lead/:teamLeadId", authorize(UserRole.ADMIN), assignTeamLead)
router.put("/:id/remove-team-lead/:teamLeadId", authorize(UserRole.ADMIN), removeTeamLead)

export default router
