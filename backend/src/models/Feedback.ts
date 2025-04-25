import mongoose, { type Document, Schema } from "mongoose"

export enum FeedbackType {
  ATTENDANCE = "attendance",
  PAYMENT = "payment",
  WORK_CONDITION = "workCondition",
  OTHER = "other",
}

export interface IFeedback extends Document {
  labour: mongoose.Types.ObjectId
  type: FeedbackType
  message: string
  isResolved: boolean
  resolvedBy?: mongoose.Types.ObjectId
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const FeedbackSchema: Schema = new Schema(
  {
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(FeedbackType),
      required: true,
    },
    message: {
      type: String,
      required: [true, "Please add a feedback message"],
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema)
