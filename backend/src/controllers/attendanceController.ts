import type { Request, Response, NextFunction } from "express"
import Attendance from "../models/Attendance"
import Labour from "../models/Labour"
import Project from "../models/Project"
import Farmer from "../models/Farmer"
import ErrorResponse from "../utils/errorResponse"
import { UserRole } from "../models/User"

// Interface for project summary in getLabourAttendanceSummary
interface ProjectSummary {
  [key: string]: {
    project: any;
    farmer: any;
    totalDays: number;
    presentDays: number;
    totalWages: number;
  }
}

// Interface for project summary in getFarmerAttendanceSummary
interface FarmerProjectSummary {
  [key: string]: {
    project: any;
    totalDays: number;
    presentDays: number;
    totalWages: number;
    labours: Set<string>;
    totalLabours?: number;
  }
}

// Interface for labour summary in getProjectAttendanceSummary
interface LabourSummary {
  [key: string]: {
    labour: any;
    totalDays: number;
    presentDays: number;
    totalWages: number;
  }
}

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendances = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // If user is a team lead, only get attendance records created by them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      reqQuery.teamLead = req.user!.id
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    // Finding resource
    query = Attendance.find(JSON.parse(queryStr))
      .populate("labour", "name")
      .populate("project", "name type")
      .populate("farmer", "name village")
      .populate("teamLead", "name")

    // Select Fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(",").join(" ")
      query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-date")
    }

    // Pagination
    const page = Number.parseInt(req.query.page as string, 10) || 1
    const limit = Number.parseInt(req.query.limit as string, 10) || 100
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Attendance.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    // Executing query
    const attendances = await query

    // Pagination result
    const pagination: any = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    res.status(200).json({
      success: true,
      count: attendances.length,
      pagination,
      data: attendances,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let attendance

    // If user is a team lead, only get attendance record created by them
    if (req.user!.role === UserRole.TEAM_LEAD) {
      attendance = await Attendance.findOne({
        _id: req.params.id,
        teamLead: req.user!.id,
      })
        .populate("labour", "name")
        .populate("project", "name type")
        .populate("farmer", "name village")
        .populate("teamLead", "name")
    } else {
      // Admin can see any attendance record
      attendance = await Attendance.findById(req.params.id)
        .populate("labour", "name")
        .populate("project", "name type")
        .populate("farmer", "name village")
        .populate("teamLead", "name")
    }

    if (!attendance) {
      return next(new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
      success: true,
      data: attendance,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/TeamLead
export const createAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add team lead to req.body
    req.body.teamLead = req.user!.id

    // Check if labour exists and belongs to team lead
    const labour = await Labour.findById(req.body.labour)

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${req.body.labour}`, 404))
    }

    if (req.user!.role === UserRole.TEAM_LEAD && labour.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`Labour ${req.body.labour} is not assigned to Team Lead ${req.user!.id}`, 401))
    }

    // Check if project exists and belongs to team lead
    const project = await Project.findById(req.body.project)

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404))
    }

    if (req.user!.role === UserRole.TEAM_LEAD && project.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`Project ${req.body.project} is not assigned to Team Lead ${req.user!.id}`, 401))
    }

    // Set farmer from project
    req.body.farmer = project.farmer

    // Calculate wages based on project daily wage rate
    if (req.body.isPresent) {
      req.body.wages = project.dailyWageRate

      // Adjust wages based on work hours if provided
      if (req.body.workHours && req.body.workHours < 8) {
        req.body.wages = (req.body.workHours / 8) * project.dailyWageRate
      }
    } else {
      req.body.wages = 0
    }

    // Check for duplicate attendance record
    const existingAttendance = await Attendance.findOne({
      date: new Date(req.body.date).setHours(0, 0, 0, 0),
      labour: req.body.labour,
      project: req.body.project,
    })

    if (existingAttendance) {
      return next(
        new ErrorResponse(`Attendance record already exists for this labour on this date for this project`, 400),
      )
    }

    const attendance = await Attendance.create(req.body)

    res.status(201).json({
      success: true,
      data: attendance,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/TeamLead
export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let attendance = await Attendance.findById(req.params.id)

    if (!attendance) {
      return next(new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is admin or the team lead who created this attendance record
    if (req.user!.role !== UserRole.ADMIN && attendance.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to update this attendance record`, 401))
    }

    // If changing project, update farmer and recalculate wages
    if (req.body.project && req.body.project !== attendance.project.toString()) {
      const project = await Project.findById(req.body.project)

      if (!project) {
        return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404))
      }

      if (req.user!.role === UserRole.TEAM_LEAD && project.teamLead.toString() !== req.user!.id) {
        return next(new ErrorResponse(`Project ${req.body.project} is not assigned to Team Lead ${req.user!.id}`, 401))
      }

      // Set farmer from project
      req.body.farmer = project.farmer
    }

    // Recalculate wages if isPresent or workHours changed
    if (req.body.isPresent !== undefined || req.body.workHours !== undefined || req.body.project) {
      const projectId = req.body.project || attendance.project
      const project = await Project.findById(projectId)

      if (!project) {
        return next(new ErrorResponse(`Project not found with id of ${projectId}`, 404))
      }

      const isPresent = req.body.isPresent !== undefined ? req.body.isPresent : attendance.isPresent

      if (isPresent) {
        const workHours = req.body.workHours !== undefined ? req.body.workHours : attendance.workHours

        if (workHours && workHours < 8) {
          req.body.wages = (workHours / 8) * project.dailyWageRate
        } else {
          req.body.wages = project.dailyWageRate
        }
      } else {
        req.body.wages = 0
      }
    }

    attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: attendance,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/TeamLead
export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await Attendance.findById(req.params.id)

    if (!attendance) {
      return next(new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is admin or the team lead who created this attendance record
    if (req.user!.role !== UserRole.ADMIN && attendance.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`User ${req.user!.id} is not authorized to delete this attendance record`, 401))
    }

    await attendance.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get attendance summary by labour
// @route   GET /api/attendance/summary/labour/:labourId
// @access  Private
export const getLabourAttendanceSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { labourId } = req.params
    const { startDate, endDate } = req.query

    // Check if labour exists and belongs to team lead
    const labour = await Labour.findById(labourId)

    if (!labour) {
      return next(new ErrorResponse(`Labour not found with id of ${labourId}`, 404))
    }

    if (req.user!.role === UserRole.TEAM_LEAD && labour.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`Labour ${labourId} is not assigned to Team Lead ${req.user!.id}`, 401))
    }

    // Build query
    const query: any = { labour: labourId }

    if (req.user!.role === UserRole.TEAM_LEAD) {
      query.teamLead = req.user!.id
    }

    if (startDate) {
      query.date = { $gte: new Date(startDate as string) }
    }

    if (endDate) {
      if (!query.date) query.date = {}
      query.date.$lte = new Date(endDate as string)
    }

    // Get attendance records
    const attendances = await Attendance.find(query)
      .populate("project", "name type dailyWageRate")
      .populate("farmer", "name village")
      .sort("date")

    // Calculate summary
    const totalDays = attendances.length
    const presentDays = attendances.filter((a) => a.isPresent).length
    const totalWages = attendances.reduce((sum, a) => sum + a.wages, 0)

    // Group by project
    const projectSummary: ProjectSummary = {}
    attendances.forEach((a) => {
      const projectId = a.project._id.toString()
      if (!projectSummary[projectId]) {
        projectSummary[projectId] = {
          project: a.project,
          farmer: a.farmer,
          totalDays: 0,
          presentDays: 0,
          totalWages: 0,
        }
      }

      projectSummary[projectId].totalDays++
      if (a.isPresent) projectSummary[projectId].presentDays++
      projectSummary[projectId].totalWages += a.wages
    })

    res.status(200).json({
      success: true,
      data: {
        labour,
        summary: {
          totalDays,
          presentDays,
          absentDays: totalDays - presentDays,
          attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
          totalWages,
        },
        projectSummary: Object.values(projectSummary),
        attendances,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get attendance summary by farmer
// @route   GET /api/attendance/summary/farmer/:farmerId
// @access  Private
export const getFarmerAttendanceSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId } = req.params
    const { startDate, endDate } = req.query

    // Check if farmer exists and team lead is assigned to farmer
    const farmer = await Farmer.findById(farmerId)

    if (!farmer) {
      return next(new ErrorResponse(`Farmer not found with id of ${farmerId}`, 404))
    }

    if (req.user!.role === UserRole.TEAM_LEAD && !farmer.teamLeads.includes(req.user!.id)) {
      return next(new ErrorResponse(`Team Lead ${req.user!.id} is not assigned to Farmer ${farmerId}`, 401))
    }

    // Build query
    const query: any = { farmer: farmerId }

    if (req.user!.role === UserRole.TEAM_LEAD) {
      query.teamLead = req.user!.id
    }

    if (startDate) {
      query.date = { $gte: new Date(startDate as string) }
    }

    if (endDate) {
      if (!query.date) query.date = {}
      query.date.$lte = new Date(endDate as string)
    }

    // Get attendance records
    const attendances = await Attendance.find(query)
      .populate("labour", "name")
      .populate("project", "name type dailyWageRate")
      .sort("date")

    // Calculate summary
    const totalLabours = new Set(attendances.map((a) => a.labour._id.toString())).size
    const totalDays = attendances.length
    const presentDays = attendances.filter((a) => a.isPresent).length
    const totalWages = attendances.reduce((sum, a) => sum + a.wages, 0)

    // Group by project
    const projectSummary: FarmerProjectSummary = {}
    attendances.forEach((a) => {
      const projectId = a.project._id.toString()
      if (!projectSummary[projectId]) {
        projectSummary[projectId] = {
          project: a.project,
          totalDays: 0,
          presentDays: 0,
          totalWages: 0,
          labours: new Set(),
        }
      }

      projectSummary[projectId].totalDays++
      if (a.isPresent) projectSummary[projectId].presentDays++
      projectSummary[projectId].totalWages += a.wages
      projectSummary[projectId].labours.add(a.labour._id.toString())
    })

    // Convert Sets to counts
    Object.values(projectSummary).forEach((project: any) => {
      project.totalLabours = project.labours.size
      delete project.labours
    })

    res.status(200).json({
      success: true,
      data: {
        farmer,
        summary: {
          totalLabours,
          totalDays,
          presentDays,
          absentDays: totalDays - presentDays,
          attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
          totalWages,
        },
        projectSummary: Object.values(projectSummary),
        attendances,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get attendance summary by project
// @route   GET /api/attendance/summary/project/:projectId
// @access  Private
export const getProjectAttendanceSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params
    const { startDate, endDate } = req.query

    // Check if project exists and belongs to team lead
    const project = await Project.findById(projectId)

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${projectId}`, 404))
    }

    if (req.user!.role === UserRole.TEAM_LEAD && project.teamLead.toString() !== req.user!.id) {
      return next(new ErrorResponse(`Project ${projectId} is not assigned to Team Lead ${req.user!.id}`, 401))
    }

    // Build query
    const query: any = { project: projectId }

    if (req.user!.role === UserRole.TEAM_LEAD) {
      query.teamLead = req.user!.id
    }

    if (startDate) {
      query.date = { $gte: new Date(startDate as string) }
    }

    if (endDate) {
      if (!query.date) query.date = {}
      query.date.$lte = new Date(endDate as string)
    }

    // Get attendance records
    const attendances = await Attendance.find(query)
      .populate("labour", "name")
      .populate("farmer", "name village")
      .sort("date")

    // Calculate summary
    const totalLabours = new Set(attendances.map((a) => a.labour._id.toString())).size
    const totalDays = attendances.length
    const presentDays = attendances.filter((a) => a.isPresent).length
    const totalWages = attendances.reduce((sum, a) => sum + a.wages, 0)

    // Group by labour
    const labourSummary: LabourSummary = {}
    attendances.forEach((a) => {
      const labourId = a.labour._id.toString()
      if (!labourSummary[labourId]) {
        labourSummary[ labourId] = {
          labour: a.labour,
          totalDays: 0,
          presentDays: 0,
          totalWages: 0,
        }
      }

      labourSummary[labourId].totalDays++
      if (a.isPresent) labourSummary[labourId].presentDays++
      labourSummary[labourId].totalWages += a.wages
    })

    res.status(200).json({
      success: true,
      data: {
        project,
        farmer: attendances.length > 0 ? attendances[0].farmer : null,
        summary: {
          totalLabours,
          totalDays,
          presentDays,
          absentDays: totalDays - presentDays,
          attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
          totalWages,
        },
        labourSummary: Object.values(labourSummary),
        attendances,
      },
    })
  } catch (err) {
    next(err)
  }
}