import type { Request, Response, NextFunction } from "express"
import Project from "../models/Project"
import Farmer from "../models/Farmer"
import ErrorResponse from "../utils/errorResponse"
import { UserRole } from "../models/User"

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query

    // If user is a team lead, only get projects assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      query = Project.find({ teamLead: req.user!.id })
        .populate("farmer", "name village")
        .populate("teamLead", "name mobileNumber")
    } else {
      // Admin can see all projects
      query = Project.find().populate("farmer", "name village").populate("teamLead", "name mobileNumber")
    }

    const projects = await query

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let project

    // If user is a team lead, only get project assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      project = await Project.findOne({
        _id: req.params.id,
        teamLead: req.user!.id,
      })
        .populate("farmer", "name village")
        .populate("teamLead", "name mobileNumber")
    } else {
      // Admin can see any project
      project = await Project.findById(req.params.id)
        .populate("farmer", "name village")
        .populate("teamLead", "name mobileNumber")
    }

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If team lead is creating, set them as the teamLead
    if (req.user!.role === UserRole.TEAM_LEAD) {
      req.body.teamLead = req.user!.id
    }

    // Check if farmer exists and team lead is assigned to farmer
    const farmer = await Farmer.findById(req.body.farmer)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.body.farmer}`, 404))
    }

    // If team lead is creating, check if they are assigned to the farmer
    if (req.user!.role === UserRole.TEAM_LEAD && !farmer.teamLeads.includes(req.user!.id)) {
      return next(new ErrorResponse(`Team Lead ${req.user!.id} is not assigned to Farmer ${req.body.farmer}`, 401))
    }

    const project = await Project.create(req.body)

    res.status(201).json({
      success: true,
      data: project,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let project = await Project.findById(req.params.id)

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is admin or the team lead assigned to this project
    if (req.user!.role !== UserRole.ADMIN && project.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to update this project`, 401))
    }

    // If changing farmer, check if team lead is assigned to new farmer
    if (req.body.farmer && req.body.farmer !== project.farmer.toString() && req.user!.role === UserRole.TEAM_LEAD) {
      const farmer = await Farmer.findById(req.body.farmer)

      if (!farmer) {
        return next(new ErrorResponse(`Farmer not found with id of ${req.body.farmer}`, 404))
      }

      if (!farmer.teamLeads.includes(req.user!.id)) {
        return next(new ErrorResponse(`Team Lead ${req.user!.id} is not assigned to Farmer ${req.body.farmer}`, 401))
      }
    }

    // Team leads cannot change the teamLead field
    if (req.user!.role === UserRole.TEAM_LEAD && req.body.teamLead) {
      delete req.body.teamLead
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is admin or the team lead assigned to this project
    if (req.user!.role !== UserRole.ADMIN && project.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to delete this project`, 401))
    }

    await project.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
