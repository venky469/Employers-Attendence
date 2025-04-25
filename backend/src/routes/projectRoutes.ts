import express from "express"
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectController"
import { protect } from "../middleware/auth"

const router = express.Router()

// Protect all routes
router.use(protect)

router.route("/").get(getProjects).post(createProject)

router.route("/:id").get(getProject).put(updateProject).delete(deleteProject)

export default router
