import type { Request, Response, NextFunction } from "express"
import Labour from "../models/Labour"
import ErrorResponse from "../utils/errorResponse"
import { uploadImage } from "../utils/cloudinary"
import { UserRole } from "../models/User"

// @desc    Get all labours
// @route   GET /api/labours
// @access  Private
export const getLabours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query

    // If user is a team lead, only get labours assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      query = Labour.find({ teamLead: req.user!.id })
    } else {
      // Admin can see all labours
      query = Labour.find().populate("teamLead", "name mobileNumber")
    }

    const labours = await query

    res.status(200).json({
      success: true,
      count: labours.length,
      data: labours,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single labour
// @route   GET /api/labours/:id
// @access  Private
export const getLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let labour

    // If user is a team lead, only get labour assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      labour = await Labour.findOne({
        _id: req.params.id,
        teamLead: req.user!.id,
      })
    } else {
      // Admin can see any labour
      labour = await Labour.findById(req.params.id).populate("teamLead", "name mobileNumber")
    }

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: labour,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create labour
// @route   POST /api/labours
// @access  Private/TeamLead
export const createLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add team lead to req.body
    req.body.teamLead = req.user!.id

    // Handle profile image upload
    if (req.body.profileImageBase64) {
      req.body.profileImage = await uploadImage(req.body.profileImageBase64, "labours")
    }

    const labour = await Labour.create(req.body)

    res.status(201).json({
      success: true,
      data: labour,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update labour
// @route   PUT /api/labours/:id
// @access  Private/TeamLead
export const updateLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let labour = await Labour.findById(req.params.id)

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is labour's team lead or an admin
    if (labour.teamLead.toString() !== req.user!.id && req.user!.role !== UserRole.ADMIN) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to update this labour`, 401))
    }

    // Handle profile image upload
    if (req.body.profileImageBase64) {
      req.body.profileImage = await uploadImage(req.body.profileImageBase64, "labours")
    }

    labour = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: labour,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete labour
// @route   DELETE /api/labours/:id
// @access  Private/TeamLead
export const deleteLabour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labour = await Labour.findById(req.params.id)

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is labour's team lead or an admin
    if (labour.teamLead.toString() !== req.user!.id && req.user!.role !== UserRole.ADMIN) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to delete this labour`, 401))
    }

    await labour.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
