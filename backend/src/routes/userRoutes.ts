import express from "express"
import { getUsers, getUser, createUser, updateUser, deleteUser, approveTeamLead } from "../controllers/userController"
import { protect, authorize } from "../middleware/auth"
import { UserRole } from "../models/User"

const router = express.Router()

// Protect all routes
router.use(protect)
router.use(authorize(UserRole.ADMIN))

router.route("/").get(getUsers).post(createUser)

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

router.put("/:id/approve", approveTeamLead)

export default router
