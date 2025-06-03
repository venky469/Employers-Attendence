// import express, { type Express } from "express"
// import mongoose from "mongoose"
// import cors from "cors"
// import dotenv from "dotenv"
// import helmet from "helmet"
// import morgan from "morgan"

// // Import routes
// import authRoutes from "./routes/authRoutes"
// import userRoutes from "./routes/userRoutes"
// import labourRoutes from "./routes/labourRoutes"
// import farmerRoutes from "./routes/farmerRoutes"
// import attendanceRoutes from "./routes/attendanceRoutes"
// import projectRoutes from "./routes/projectRoutes"

// dotenv.config()

// const app: Express = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(express.json({ limit: "50mb" }))
// app.use(express.urlencoded({ extended: true, limit: "50mb" }))
// app.use(cors())
// app.use(helmet())
// app.use(morgan("dev"))

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI as string)
//   .then(() => {
//     console.log("Connected to MongoDB")
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error)
//   })

// // Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/labours", labourRoutes)
// app.use("/api/farmers", farmerRoutes)
// app.use("/api/attendance", attendanceRoutes)
// app.use("/api/projects", projectRoutes)

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   const statusCode = err.statusCode || 500
//   const message = err.message || "Internal Server Error"
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   })
// })

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

// export default app



import express, { type Express } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"

// Import routes
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import labourRoutes from "./routes/labourRoutes"
import farmerRoutes from "./routes/farmerRoutes"
import attendanceRoutes from "./routes/attendanceRoutes"
import projectRoutes from "./routes/projectRoutes"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// // Determine CORS settings based on environment (allow any origin in development)
// const allowedOrigins = process.env.NODE_ENV === "production"
//   ? ["https://your-production-domain.com"] // Change this to your production domain
//   : "*"; // Allow all origins in development

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(helmet())
app.use(morgan("dev"))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Routes
app.use("/health", (req, res) => res.status(200).json({ status: "OK" }))
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/labours", labourRoutes)
app.use("/api/farmers", farmerRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/projects", projectRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

