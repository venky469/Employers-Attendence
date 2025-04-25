import type { Request, Response, NextFunction } from "express"
import Farmer from "../models/Farmer"
import ErrorResponse from "../utils/errorResponse"
import { UserRole } from "../models/User"
import { Types } from "mongoose"

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Private
export const getFarmers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query

    // If user is a team lead, only get farmers assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      query = Farmer.find({ teamLeads: req.user!.id })
    } else {
      // Admin can see all farmers
      query = Farmer.find().populate("teamLeads", "name mobileNumber")
    }

    const farmers = await query

    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single farmer
// @route   GET /api/farmers/:id
// @access  Private
export const getFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let farmer

    // If user is a team lead, only get farmer assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      farmer = await Farmer.findOne({
        _id: req.params.id,
        teamLeads: req.user!.id,
      })
    } else {
      // Admin can see any farmer
      farmer = await Farmer.findById(req.params.id).populate("teamLeads", "name mobileNumber")
    }

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: farmer,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create farmer
// @route   POST /api/farmers
// @access  Private/Admin
export const createFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If team lead is creating, add them to teamLeads array
    if (req.user!.role === UserRole.TEAM_LEAD) {
      if (!req.body.teamLeads) {
        req.body.teamLeads = []
      }
      req.body.teamLeads.push(req.user!.id)
    }

    const farmer = await Farmer.create(req.body)

    res.status(201).json({
      success: true,
      data: farmer,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update farmer
// @route   PUT /api/farmers/:id
// @access  Private/Admin
export const updateFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let farmer = await Farmer.findById(req.params.id)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is admin or a team lead assigned to this farmer
    if (req.user!.role !== UserRole.ADMIN && !farmer.teamLeads.includes(req.user!.id)) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to update this farmer`, 401))
    }

    // If team lead is updating, ensure they remain in teamLeads array
    if (req.user!.role === UserRole.TEAM_LEAD && req.body.teamLeads) {
      if (!req.body.teamLeads.includes(req.user!.id)) {
        req.body.teamLeads.push(req.user!.id)
      }
    }

    farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: farmer,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete farmer
// @route   DELETE /api/farmers/:id
// @access  Private/Admin
export const deleteFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmer = await Farmer.findById(req.params.id)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404))
    }

    // Only admin can delete farmers
    if (req.user!.role !== UserRole.ADMIN) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to delete this farmer`, 401))
    }

    await farmer.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Assign team lead to farmer
// @route   PUT /api/farmers/:id/assign-team-lead/:teamLeadId
// @access  Private/Admin
export const assignTeamLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmer = await Farmer.findById(req.params.id)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404))
    }

    // Convert teamLeadId to ObjectId
    const teamLeadId = new Types.ObjectId(req.params.teamLeadId)

    // Check if team lead is already assigned
    if (farmer.teamLeads.includes(teamLeadId)) {
      return next(new ErrorResponse(`Team Lead ${req.params.teamLeadId} is already assigned to this farmer`, 400))
    }

    // Add team lead to farmer
    farmer.teamLeads.push(teamLeadId)
    await farmer.save()

    res.status(200).json({
      success: true,
      data: farmer,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Remove team lead from farmer
// @route   PUT /api/farmers/:id/remove-team-lead/:teamLeadId
// @access  Private/Admin
export const removeTeamLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmer = await Farmer.findById(req.params.id)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404))
    }

    // Convert teamLeadId to ObjectId
    const teamLeadId = new Types.ObjectId(req.params.teamLeadId)

    // Check if team lead is assigned
    if (!farmer.teamLeads.includes(teamLeadId)) {
      return next(new ErrorResponse(`Team Lead ${req.params.teamLeadId} is not assigned to this farmer`, 400))
    }

    // Remove team lead from farmer
    farmer.teamLeads = farmer.teamLeads.filter((id) => !id.equals(teamLeadId))
    await farmer.save()

    res.status(200).json({
      success: true,
      data: farmer,
    })
  } catch (err) {
    next(err)
  }
}