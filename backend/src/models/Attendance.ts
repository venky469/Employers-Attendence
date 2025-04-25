import mongoose, { type Document, Schema } from "mongoose"

export interface IAttendance extends Document {
  date: Date
  labour: mongoose.Types.ObjectId
  project: mongoose.Types.ObjectId
  farmer: mongoose.Types.ObjectId
  teamLead: mongoose.Types.ObjectId
  isPresent: boolean
  workHours?: number
  wages: number
  remarks?: string
  createdAt: Date
  updatedAt: Date
}

const AttendanceSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Please add a date"],
      default: Date.now,
    },
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPresent: {
      type: Boolean,
      default: true,
    },
    workHours: {
      type: Number,
    },
    wages: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Create a compound index to prevent duplicate attendance records
AttendanceSchema.index({ date: 1, labour: 1, project: 1 }, { unique: true })

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema)
