import mongoose, { type Document, Schema } from "mongoose"

export enum ProjectType {
  SOWING = "sowing",
  HARVESTING = "harvesting",
  WEEDING = "weeding",
  FERTILIZING = "fertilizing",
  IRRIGATION = "irrigation",
  OTHER = "other",
}

export interface IProject extends Document {
  name: string
  type: ProjectType
  description?: string
  startDate: Date
  endDate?: Date
  dailyWageRate: number
  farmer: mongoose.Types.ObjectId
  teamLead: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a project name"],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ProjectType),
      required: [true, "Please specify project type"],
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, "Please add a start date"],
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    dailyWageRate: {
      type: Number,
      required: [true, "Please add daily wage rate"],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IProject>("Project", ProjectSchema)
