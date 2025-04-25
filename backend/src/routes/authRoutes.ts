import express from "express"
import { register, login, getMe, updateDetails, updatePassword, logout } from "../controllers/authController"
import { protect } from "../middleware/auth"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.put("/updatedetails", protect, updateDetails)
router.put("/updatepassword", protect, updatePassword)
router.get("/logout", logout)

export default router
