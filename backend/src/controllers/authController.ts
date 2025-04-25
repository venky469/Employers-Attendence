import type { Request, Response, NextFunction } from "express"
import User, { type IUser, UserRole } from "../models/User"
import ErrorResponse from "../utils/errorResponse"
import { uploadImage } from "../utils/cloudinary"

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobileNumber, password, role, address, village, profileImageBase64, preferredLanguage } =
      req.body

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
      isApproved: role === UserRole.ADMIN, // Admin is auto-approved
    })

    sendTokenResponse(user, 201, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobileNumber, password } = req.body

    // Validate mobile & password
    if (!mobileNumber || !password) {
      return next(new ErrorResponse("Please provide mobile number and password", 400))
    }

    // Check for user
    const user = await User.findOne({ mobileNumber }).select("+password")

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401))
    }

    // Check if Team Lead is approved
    if (user.role === UserRole.TEAM_LEAD && !user.isApproved) {
      return next(new ErrorResponse("Your account is pending approval from admin", 403))
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldsToUpdate: {
      name: any;
      email: any;
      address: any;
      village: any;
      preferredLanguage: any;
      profileImage?: string; // Change to optional string
    } = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      village: req.body.village,
      preferredLanguage: req.body.preferredLanguage,
      profileImage: undefined,
    }

    // Handle profile image update
    if (req.body.profileImageBase64) {
      fieldsToUpdate.profileImage = await uploadImage(req.body.profileImageBase64, "users")
    }

    const user = await User.findByIdAndUpdate(req.user!.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).select("+password")

    // Check current password
    if (!(await user!.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401))
    }

    user!.password = req.body.newPassword
    await user!.save()

    sendTokenResponse(user!, 200, res)
  } catch (err) {
    next(err)
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken()

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      isApproved: user.isApproved,
      preferredLanguage: user.preferredLanguage,
      profileImage: user.profileImage,
    },
  })
}
