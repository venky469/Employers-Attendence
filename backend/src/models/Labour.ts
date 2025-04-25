import mongoose, { type Document, Schema } from "mongoose"

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface ILabour extends Document {
  name: string
  mobileNumber?: string
  address?: string
  age?: number
  gender?: Gender
  profileImage?: string
  teamLead: mongoose.Types.ObjectId
  isActive: boolean
  preferredLanguage: "telugu" | "english"
  createdAt: Date
  updatedAt: Date
}

const LabourSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    profileImage: {
      type: String,
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
    preferredLanguage: {
      type: String,
      enum: ["telugu", "english"],
      default: "telugu",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ILabour>("Labour", LabourSchema)
