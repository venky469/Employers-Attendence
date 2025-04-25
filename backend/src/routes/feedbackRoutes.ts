import express from "express"
import {
  getFeedbacks,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController"
import { protect, authorize } from "../middleware/auth"
import { UserRole } from "../models/User"

const router = express.Router()

// Public route for creating feedback
router.post("/", createFeedback)

// Protect all other routes
router.use(protect)

router.get("/", getFeedbacks)
router.get("/:id", getFeedback)
router.put("/:id", updateFeedback)
router.delete("/:id", authorize(UserRole.ADMIN), deleteFeedback)

export default router
