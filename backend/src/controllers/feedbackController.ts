import type { Request, Response, NextFunction } from "express"
import Feedback from "../models/Feedback"
import Labour from "../models/Labour"
import ErrorResponse from "../utils/errorResponse"
import { UserRole } from "../models/User"

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
export const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query

    // If user is a team lead, only get feedback for labours assigned to them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      const labours = await Labour.find({ teamLead: req.user!.id }).select("_id")
      const labourIds = labours.map((labour) => labour._id)

      query = Feedback.find({ labour: { $in: labourIds } })
        .populate("labour", "name")
        .populate("resolvedBy", "name")
    } else {
      // Admin can see all feedback
      query = Feedback.find().populate("labour", "name").populate("resolvedBy", "name")
    }

    // Filter by resolved status if provided
    if (req.query.isResolved !== undefined) {
      query = query.find({ isResolved: req.query.isResolved === "true" })
    }

    // Sort by created date (newest first)
    query = query.sort("-createdAt")

    const feedbacks = await query

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("labour", "name").populate("resolvedBy", "name")

    if (!feedback) {
      return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
    }

    // Check if user is authorized to view this feedback
    if (req.user!.role === UserRole.TEAM_LEAD) {
      const labour = await Labour.findById(feedback.labour)

      if (!labour || labour.teamLead.toString() !== req.user!.id) {
        return next(new ErrorResponse(`User ${req.user!.id} is not authorized to view this feedback`, 401))
      }
    }

    res.status(200).json({
      success: true,
      data: feedback,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Public
export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if labour exists
    const labour = await Labour.findById(req.body.labour)

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${req.body.labour}`, 404))
    }

    const feedback = await Feedback.create(req.body)

    res.status(201).json({
      success: true,
      data: feedback,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update feedback (mark as resolved)
// @route   PUT /api/feedback/:id
// @access  Private
export const updateFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
    }

    // Check if user is authorized to update this feedback
    if (req.user!.role === UserRole.TEAM_LEAD) {
      const labour = await Labour.findById(feedback.labour)

      if (!labour || labour.teamLead.toString() !== req.user!.id) {
        return next(new ErrorResponse(`User ${req.user!.id} is not authorized to update this feedback`, 401))
      }
    }

    // If marking as resolved, add resolvedBy and resolvedAt
    if (req.body.isResolved && !feedback.isResolved) {
      req.body.resolvedBy = req.user!.id
      req.body.resolvedAt = new Date()
    }

    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: feedback,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return next(new ErrorResponse(`Feedback not found with id of ${req.params.id}`, 404))
    }

    // Only admin can delete feedback
    if (req.user!.role !== UserRole.ADMIN) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to delete this feedback`, 401))
    }

    await feedback.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
