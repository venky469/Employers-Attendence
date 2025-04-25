// import type { Request, Response, NextFunction } from "express"
// import jwt from "jsonwebtoken"
// import User, { type IUser, UserRole } from "../models/User"
// import ErrorResponse from "../utils/errorResponse"

// // Extend Express Request interface to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUser
//     }
//   }
// }

// // Protect routes
// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//   let token

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     // Set token from Bearer token in header
//     token = req.headers.authorization.split(" ")[1]
//   }

//   // Make sure token exists
//   if (!token) {
//     return next(new ErrorResponse("Not authorized to access this route", 401))
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       id: string
//       role: string
//     }

//     req.user = await User.findById(decoded.id)

//     if (!req.user) {
//       return next(new ErrorResponse("User not found", 404))
//     }

//     if (req.user.role === UserRole.TEAM_LEAD && !req.user.isApproved) {
//       return next(new ErrorResponse("Your account is pending approval from admin", 403))
//     }

//     next()
//   } catch (err) {
//     return next(new ErrorResponse("Not authorized to access this route", 401))
//   }
// }

// // Grant access to specific roles
// export const authorize = (...roles: UserRole[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return next(new ErrorResponse("Not authorized to access this route", 401))
//     }

//     if (!roles.includes(req.user.role as UserRole)) {
//       return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
//     }
//     next()
//   }
// }




import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { type IUser, UserRole } from "../models/User"
import ErrorResponse from "../utils/errorResponse"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

// Protect routes
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1]
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string
      role: string
    }

    const user = await User.findById(decoded.id)
    
    if (!user) {
      return next(new ErrorResponse("User not found", 404))
    }

    req.user = user

    if (req.user.role === UserRole.TEAM_LEAD && !req.user.isApproved) {
      return next(new ErrorResponse("Your account is pending approval from admin", 403))
    }

    next()
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401))
  }
}

// Grant access to specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorResponse("Not authorized to access this route", 401))
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }
    next()
  }
}