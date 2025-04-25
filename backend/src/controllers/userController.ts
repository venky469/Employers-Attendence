import type { Request, Response, NextFunction } from "express"
import User, { UserRole } from "../models/User"
import ErrorResponse from "../utils/errorResponse"
import { uploadImage } from "../utils/cloudinary"

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: UserRole.TEAM_LEAD })

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      password,
      role,
      address,
      village,
      profileImageBase64,
      preferredLanguage,
      isApproved,
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ mobileNumber })

    if (existingUser) {
      return next(new ErrorResponse("User with this mobile number already exists", 400))
    }

    let profileImage
    if (profileImageBase64) {
      profileImage = await uploadImage(profileImageBase64, "users")
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobileNumber,
      password,
      role: role || UserRole.TEAM_LEAD,
      address,
      village,
      profileImage,
      preferredLanguage: preferredLanguage || "telugu",
      isApproved: isApproved !== undefined ? isApproved : role === UserRole.ADMIN,
    })

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldsToUpdate: {
      name: any;
      email: any;
      role: any;
      address: any;
      village: any;
      preferredLanguage: any;
      isApproved: any;
      profileImage?: string;
    } = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      address: req.body.address,
      village: req.body.village,
      preferredLanguage: req.body.preferredLanguage,
      isApproved: req.body.isApproved,
      profileImage: undefined,
    }

    // Handle profile image update
    if (req.body.profileImageBase64) {
      fieldsToUpdate.profileImage = await uploadImage(req.body.profileImageBase64, "users")
    }

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    await user.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Approve team lead
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
export const approveTeamLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    if (user.role !== UserRole.TEAM_LEAD) {
      return next(new ErrorResponse(`User is not a Team Lead`, 400))
    }

    user.isApproved = true
    await user.save()

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}