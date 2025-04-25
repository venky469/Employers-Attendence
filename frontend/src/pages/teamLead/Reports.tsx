// // "use client"

// // import type React from "react"

// // import { useState, useEffect } from "react"
// // import { useTranslation } from "react-i18next"
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Grid,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Button,
// //   CircularProgress,
// //   Tabs,
// //   Tab,
// //   Divider,
// //   Card,
// //   CardContent,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// // } from "@mui/material"
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
// // import {
// //   PictureAsPdf as PdfIcon,
// //   BarChart as BarChartIcon,
// //   Person as PersonIcon,
// //   Agriculture as AgricultureIcon,
// //   Assignment as AssignmentIcon,
// // } from "@mui/icons-material"
// // import { api } from "../../utils/api"
// // import PageHeader from "../../components/common/PageHeader"
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts"

// // const Reports = () => {
// //   const { t } = useTranslation()
// //   const [tabValue, setTabValue] = useState(0)
// //   const [reportType, setReportType] = useState<"labour" | "farmer" | "project">("labour")
// //   const [selectedId, setSelectedId] = useState<string>("")
// //   const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)))
// //   const [endDate, setEndDate] = useState<Date | null>(new Date())
// //   const [loading, setLoading] = useState(false)
// //   const [reportData, setReportData] = useState<any>(null)
// //   const [labours, setLabours] = useState<any[]>([])
// //   const [farmers, setFarmers] = useState<any[]>([])
// //   const [projects, setProjects] = useState<any[]>([])

// //   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// //   useEffect(() => {
// //     fetchLabours()
// //     fetchFarmers()
// //     fetchProjects()
// //   }, [])

// //   const fetchLabours = async () => {
// //     try {
// //       const response = await api.get("/labours")
// //       setLabours(response.data.data)
// //     } catch (error) {
// //       console.error("Error fetching labours:", error)
// //     }
// //   }

// //   const fetchFarmers = async () => {
// //     try {
// //       const response = await api.get("/farmers")
// //       setFarmers(response.data.data)
// //     } catch (error) {
// //       console.error("Error fetching farmers:", error)
// //     }
// //   }

// //   const fetchProjects = async () => {
// //     try {
// //       const response = await api.get("/projects")
// //       setProjects(response.data.data)
// //     } catch (error) {
// //       console.error("Error fetching projects:", error)
// //     }
// //   }

// //   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
// //     setTabValue(newValue)
// //   }

// //   const handleReportTypeChange = (event: any) => {
// //     setReportType(event.target.value)
// //     setSelectedId("")
// //     setReportData(null)
// //   }

// //   const handleSelectedIdChange = (event: any) => {
// //     setSelectedId(event.target.value)
// //   }

// //   const generateReport = async () => {
// //     if (!selectedId || !startDate || !endDate) return

// //     try {
// //       setLoading(true)
// //       const formattedStartDate = startDate.toISOString().split("T")[0]
// //       const formattedEndDate = endDate.toISOString().split("T")[0]

// //       let response
// //       if (reportType === "labour") {
// //         response = await api.get(
// //           `/attendance/summary/labour/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
// //         )
// //       } else if (reportType === "farmer") {
// //         response = await api.get(
// //           `/attendance/summary/farmer/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
// //         )
// //       } else if (reportType === "project") {
// //         response = await api.get(
// //           `/attendance/summary/project/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
// //         )
// //       }

// //       setReportData(response?.data.data)
// //     } catch (error) {
// //       console.error("Error generating report:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const exportPDF = () => {
// //     // In a real app, this would generate and download a PDF
// //     alert("PDF export functionality would be implemented here")
// //   }

// //   const renderAttendanceChart = () => {
// //     if (!reportData) return null

// //     const chartData = [
// //       {
// //         name: t("reports.presentDays"),
// //         value: reportData.summary.presentDays,
// //       },
// //       {
// //         name: t("reports.absentDays"),
// //         value: reportData.summary.absentDays,
// //       },
// //     ]

// //     return (
// //       <Box sx={{ height: 300, width: "100%" }}>
// //         <ResponsiveContainer>
// //           <PieChart>
// //             <Pie
// //               data={chartData}
// //               cx="50%"
// //               cy="50%"
// //               labelLine={false}
// //               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //               outerRadius={80}
// //               fill="#8884d8"
// //               dataKey="value"
// //             >
// //               {chartData.map((entry, index) => (
// //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //               ))}
// //             </Pie>
// //             <Tooltip />
// //             <Legend />
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </Box>
// //     )
// //   }

// //   const renderProjectChart = () => {
// //     if (!reportData || !reportData.projectSummary || reportData.projectSummary.length === 0) return null

// //     const chartData = reportData.projectSummary.map((project: any) => ({
// //       name: project.project.name,
// //       wages: project.totalWages,
// //       days: project.presentDays,
// //     }))

// //     return (
// //       <Box sx={{ height: 300, width: "100%" }}>
// //         <ResponsiveContainer>
// //           <BarChart data={chartData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" />
// //             <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
// //             <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
// //             <Tooltip />
// //             <Legend />
// //             <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
// //             <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </Box>
// //     )
// //   }

// //   const renderLabourChart = () => {
// //     if (!reportData || !reportData.labourSummary || reportData.labourSummary.length === 0) return null

// //     const chartData = reportData.labourSummary.map((labour: any) => ({
// //       name: labour.labour.name,
// //       wages: labour.totalWages,
// //       days: labour.presentDays,
// //     }))

// //     return (
// //       <Box sx={{ height: 300, width: "100%" }}>
// //         <ResponsiveContainer>
// //           <BarChart data={chartData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" />
// //             <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
// //             <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
// //             <Tooltip />
// //             <Legend />
// //             <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
// //             <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </Box>
// //     )
// //   }

// //   const renderSummary = () => {
// //     if (!reportData) return null

// //     return (
// //       <Grid container spacing={3}>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card sx={{ borderRadius: 2 }}>
// //             <CardContent>
// //               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
// //                 {t("reports.totalDays")}
// //               </Typography>
// //               <Typography variant="h4" component="div" fontWeight="bold">
// //                 {reportData.summary.totalDays}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card sx={{ borderRadius: 2 }}>
// //             <CardContent>
// //               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
// //                 {t("reports.presentDays")}
// //               </Typography>
// //               <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
// //                 {reportData.summary.presentDays}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card sx={{ borderRadius: 2 }}>
// //             <CardContent>
// //               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
// //                 {t("reports.absentDays")}
// //               </Typography>
// //               <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
// //                 {reportData.summary.absentDays}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={3}>
// //           <Card sx={{ borderRadius: 2 }}>
// //             <CardContent>
// //               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
// //                 {t("reports.totalWages")}
// //               </Typography>
// //               <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
// //                 ₹{reportData.summary.totalWages.toFixed(2)}
// //               </Typography>
// //             </CardContent>
// //           </Card>
// //         </Grid>
// //       </Grid>
// //     )
// //   }

// //   const renderAttendanceDetails = () => {
// //     if (!reportData || !reportData.attendances || reportData.attendances.length === 0) return null

// //     return (
// //       <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2 }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>{t("attendance.date")}</TableCell>
// //               {reportType !== "labour" && <TableCell>{t("attendance.labour")}</TableCell>}
// //               {reportType !== "project" && <TableCell>{t("attendance.project")}</TableCell>}
// //               <TableCell align="center">{t("attendance.isPresent")}</TableCell>
// //               <TableCell align="center">{t("attendance.workHours")}</TableCell>
// //               <TableCell align="right">{t("attendance.wages")}</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {reportData.attendances.map((attendance: any) => (
// //               <TableRow key={attendance._id}>
// //                 <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
// //                 {reportType !== "labour" && <TableCell>{attendance.labour.name}</TableCell>}
// //                 {reportType !== "project" && <TableCell>{attendance.project.name}</TableCell>}
// //                 <TableCell align="center">
// //                   <Chip
// //                     label={attendance.isPresent ? t("common.yes") : t("common.no")}
// //                     color={attendance.isPresent ? "success" : "error"}
// //                     size="small"
// //                   />
// //                 </TableCell>
// //                 <TableCell align="center">{attendance.workHours || "-"}</TableCell>
// //                 <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //     )
// //   }

// //   return (
// //     <Box>
// //       <PageHeader title={t("navigation.reports")} />

// //       <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// //         <Grid container spacing={3}>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <FormControl fullWidth>
// //               <InputLabel id="report-type-label">{t("common.select")}</InputLabel>
// //               <Select
// //                 labelId="report-type-label"
// //                 id="report-type"
// //                 value={reportType}
// //                 label={t("common.select")}
// //                 onChange={handleReportTypeChange}
// //                 startAdornment={
// //                   reportType === "labour" ? (
// //                     <PersonIcon sx={{ mr: 1 }} />
// //                   ) : reportType === "farmer" ? (
// //                     <AgricultureIcon sx={{ mr: 1 }} />
// //                   ) : (
// //                     <AssignmentIcon sx={{ mr: 1 }} />
// //                   )
// //                 }
// //               >
// //                 <MenuItem value="labour">{t("reports.labourReport")}</MenuItem>
// //                 <MenuItem value="farmer">{t("reports.farmerReport")}</MenuItem>
// //                 <MenuItem value="project">{t("reports.projectReport")}</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <FormControl fullWidth>
// //               <InputLabel id="selected-id-label">{t("common.select")}</InputLabel>
// //               <Select
// //                 labelId="selected-id-label"
// //                 id="selected-id"
// //                 value={selectedId}
// //                 label={t("common.select")}
// //                 onChange={handleSelectedIdChange}
// //               >
// //                 {reportType === "labour" &&
// //                   labours.map((labour) => (
// //                     <MenuItem key={labour._id} value={labour._id}>
// //                       {labour.name}
// //                     </MenuItem>
// //                   ))}
// //                 {reportType === "farmer" &&
// //                   farmers.map((farmer) => (
// //                     <MenuItem key={farmer._id} value={farmer._id}>
// //                       {farmer.name}
// //                     </MenuItem>
// //                   ))}
// //                 {reportType === "project" &&
// //                   projects.map((project) => (
// //                     <MenuItem key={project._id} value={project._id}>
// //                       {project.name}
// //                     </MenuItem>
// //                   ))}
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2}>
// //             <LocalizationProvider dateAdapter={AdapterDateFns}>
// //               <DatePicker
// //                 label={t("reports.startDate")}
// //                 value={startDate}
// //                 onChange={(newValue) => setStartDate(newValue)}
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={2}>
// //             <LocalizationProvider dateAdapter={AdapterDateFns}>
// //               <DatePicker
// //                 label={t("reports.endDate")}
// //                 value={endDate}
// //                 onChange={(newValue) => setEndDate(newValue)}
// //                 slotProps={{ textField: { fullWidth: true } }}
// //               />
// //             </LocalizationProvider>
// //           </Grid>
// //           <Grid item xs={12} md={2}>
// //             <Button
// //               variant="contained"
// //               fullWidth
// //               startIcon={<BarChartIcon />}
// //               onClick={generateReport}
// //               disabled={!selectedId || !startDate || !endDate}
// //               sx={{ height: "56px" }}
// //             >
// //               {t("reports.generateReport")}
// //             </Button>
// //           </Grid>
// //         </Grid>
// //       </Paper>

// //       {loading ? (
// //         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
// //           <CircularProgress />
// //         </Box>
// //       ) : reportData ? (
// //         <Paper sx={{ borderRadius: 2 }}>
// //           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
// //             <Typography variant="h6">
// //               {reportType === "labour"
// //                 ? `${t("reports.labourReport")}: ${reportData.labour.name}`
// //                 : reportType === "farmer"
// //                   ? `${t("reports.farmerReport")}: ${reportData.farmer.name}`
// //                   : `${t("reports.projectReport")}: ${reportData.project.name}`}
// //             </Typography>
// //             <Button startIcon={<PdfIcon />} onClick={exportPDF}>
// //               {t("reports.exportPDF")}
// //             </Button>
// //           </Box>
// //           <Divider />

// //           <Box sx={{ p: 3 }}>
// //             {renderSummary()}

// //             <Box sx={{ mt: 4 }}>
// //               <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
// //                 <Tab label={t("reports.summary")} />
// //                 <Tab label={t("reports.details")} />
// //               </Tabs>

// //               <Box sx={{ mt: 2 }}>
// //                 {tabValue === 0 ? (
// //                   <Grid container spacing={3}>
// //                     <Grid item xs={12} md={6}>
// //                       {renderAttendanceChart()}
// //                     </Grid>
// //                     <Grid item xs={12} md={6}>
// //                       {reportType === "project"
// //                         ? renderLabourChart()
// //                         : reportType === "labour" || reportType === "farmer"
// //                           ? renderProjectChart()
// //                           : null}
// //                     </Grid>
// //                   </Grid>
// //                 ) : (
// //                   renderAttendanceDetails()
// //                 )}
// //               </Box>
// //             </Box>
// //           </Box>
// //         </Paper>
// //       ) : null}
// //     </Box>
// //   )
// // }

// // export default Reports



// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useTranslation } from "react-i18next"
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Divider,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   CardActionArea,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
// import {
//   PictureAsPdf as PdfIcon,
//   BarChart as BarChartIcon,
//   Person as PersonIcon,
//   Agriculture as AgricultureIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material"
// import { api } from "../../utils/api"
// import PageHeader from "../../components/common/PageHeader"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"

// const Reports = () => {
//   const { t } = useTranslation()
//   const [tabValue, setTabValue] = useState(0)
//   const [reportType, setReportType] = useState<"labour" | "farmer" | "project">("labour")
//   const [selectedId, setSelectedId] = useState<string>("")
//   const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)))
//   const [endDate, setEndDate] = useState<Date | null>(new Date())
//   const [loading, setLoading] = useState(false)
//   const [reportData, setReportData] = useState<any>(null)
//   const [labours, setLabours] = useState<any[]>([])
//   const [farmers, setFarmers] = useState<any[]>([])
//   const [projects, setProjects] = useState<any[]>([])

//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm")) // Detects mobile view (xs breakpoint)

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

//   useEffect(() => {
//     fetchLabours()
//     fetchFarmers()
//     fetchProjects()
//   }, [])

//   const fetchLabours = async () => {
//     try {
//       const response = await api.get("/labours")
//       setLabours(response.data.data)
//     } catch (error) {
//       console.error("Error fetching labours:", error)
//     }
//   }

//   const fetchFarmers = async () => {
//     try {
//       const response = await api.get("/farmers")
//       setFarmers(response.data.data)
//     } catch (error) {
//       console.error("Error fetching farmers:", error)
//     }
//   }

//   const fetchProjects = async () => {
//     try {
//       const response = await api.get("/projects")
//       setProjects(response.data.data)
//     } catch (error) {
//       console.error("Error fetching projects:", error)
//     }
//   }

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   const handleReportTypeChange = (event: any) => {
//     setReportType(event.target.value)
//     setSelectedId("")
//     setReportData(null)
//   }

//   const handleSelectedIdChange = (event: any) => {
//     setSelectedId(event.target.value)
//   }

//   const generateReport = async () => {
//     if (!selectedId || !startDate || !endDate) return

//     try {
//       setLoading(true)
//       const formattedStartDate = startDate.toISOString().split("T")[0]
//       const formattedEndDate = endDate.toISOString().split("T")[0]

//       let response
//       if (reportType === "labour") {
//         response = await api.get(
//           `/attendance/summary/labour/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
//         )
//       } else if (reportType === "farmer") {
//         response = await api.get(
//           `/attendance/summary/farmer/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
//         )
//       } else if (reportType === "project") {
//         response = await api.get(
//           `/attendance/summary/project/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
//         )
//       }

//       setReportData(response?.data.data)
//     } catch (error) {
//       console.error("Error generating report:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const exportPDF = () => {
//     alert("PDF export functionality would be implemented here")
//   }

//   const renderAttendanceChart = () => {
//     if (!reportData) return null

//     const chartData = [
//       {
//         name: t("reports.presentDays"),
//         value: reportData.summary.presentDays,
//       },
//       {
//         name: t("reports.absentDays"),
//         value: reportData.summary.absentDays,
//       },
//     ]

//     return (
//       <Box sx={{ height: 300, width: "100%" }}>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </Box>
//     )
//   }

//   const renderProjectChart = () => {
//     if (!reportData || !reportData.projectSummary || reportData.projectSummary.length === 0) return null

//     const chartData = reportData.projectSummary.map((project: any) => ({
//       name: project.project.name,
//       wages: project.totalWages,
//       days: project.presentDays,
//     }))

//     return (
//       <Box sx={{ height: 300, width: "100%" }}>
//         <ResponsiveContainer>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//             <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
//             <Tooltip />
//             <Legend />
//             <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
//             <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     )
//   }

//   const renderLabourChart = () => {
//     if (!reportData || !reportData.labourSummary || reportData.labourSummary.length === 0) return null

//     const chartData = reportData.labourSummary.map((labour: any) => ({
//       name: labour.labour.name,
//       wages: labour.totalWages,
//       days: labour.presentDays,
//     }))

//     return (
//       <Box sx={{ height: 300, width: "100%" }}>
//         <ResponsiveContainer>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//             <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
//             <Tooltip />
//             <Legend />
//             <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
//             <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     )
//   }

//   const renderSummary = () => {
//     if (!reportData) return null

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                 {t("reports.totalDays")}
//               </Typography>
//               <Typography variant="h4" component="div" fontWeight="bold">
//                 {reportData.summary.totalDays}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                 {t("reports.presentDays")}
//               </Typography>
//               <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
//                 {reportData.summary.presentDays}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                 {t("reports.absentDays")}
//               </Typography>
//               <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
//                 {reportData.summary.absentDays}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                 {t("reports.totalWages")}
//               </Typography>
//               <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
//                 ₹{reportData.summary.totalWages.toFixed(2)}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     )
//   }

//   const renderAttendanceDetails = () => {
//     if (!reportData || !reportData.attendances || reportData.attendances.length === 0) return null

//     return (
//       <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>{t("attendance.date")}</TableCell>
//               {reportType !== "labour" && <TableCell>{t("attendance.labour")}</TableCell>}
//               {reportType !== "project" && <TableCell>{t("attendance.project")}</TableCell>}
//               <TableCell align="center">{t("attendance.isPresent")}</TableCell>
//               <TableCell align="center">{t("attendance.workHours")}</TableCell>
//               <TableCell align="right">{t("attendance.wages")}</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reportData.attendances.map((attendance: any) => (
//               <TableRow key={attendance._id}>
//                 <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
//                 {reportType !== "labour" && <TableCell>{attendance.labour.name}</TableCell>}
//                 {reportType !== "project" && <TableCell>{attendance.project.name}</TableCell>}
//                 <TableCell align="center">
//                   <Chip
//                     label={attendance.isPresent ? t("common.yes") : t("common.no")}
//                     color={attendance.isPresent ? "success" : "error"}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell align="center">{attendance.workHours || "-"}</TableCell>
//                 <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     )
//   }

//   const renderMobileView = () => {
//     return (
//       <Box sx={{ mt: 2 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Card
//               sx={{
//                 borderRadius: 2,
//                 border: tabValue === 0 ? `2px solid ${theme.palette.primary.main}` : "none",
//               }}
//             >
//               <CardActionArea onClick={() => setTabValue(0)}>
//                 <CardContent>
//                   <Typography variant="h6">{t("reports.summary")}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {t("reports.summaryDescription")}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           </Grid>
//           <Grid item xs={12}>
//             <Card
//               sx={{
//                 borderRadius: 2,
//                 border: tabValue === 1 ? `2px solid ${theme.palette.primary.main}` : "none",
//               }}
//             >
//               <CardActionArea onClick={() => setTabValue(1)}>
//                 <CardContent>
//                   <Typography variant="h6">{t("reports.details")}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {t("reports.detailsDescription")}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         </Grid>
//         <Box sx={{ mt: 3 }}>
//           {tabValue === 0 ? (
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 {renderAttendanceChart()}
//               </Grid>
//               <Grid item xs={12}>
//                 {reportType === "project"
//                   ? renderLabourChart()
//                   : reportType === "labour" || reportType === "farmer"
//                     ? renderProjectChart()
//                     : null}
//               </Grid>
//             </Grid>
//           ) : (
//             renderAttendanceDetails()
//           )}
//         </Box>
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <PageHeader title={t("navigation.reports")} />

//       <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth>
//               <InputLabel id="report-type-label">{t("common.select")}</InputLabel>
//               <Select
//                 labelId="report-type-label"
//                 id="report-type"
//                 value={reportType}
//                 label={t("common.select")}
//                 onChange={handleReportTypeChange}
//                 startAdornment={
//                   reportType === "labour" ? (
//                     <PersonIcon sx={{ mr: 1 }} />
//                   ) : reportType === "farmer" ? (
//                     <AgricultureIcon sx={{ mr: 1 }} />
//                   ) : (
//                     <AssignmentIcon sx={{ mr: 1 }} />
//                   )
//                 }
//               >
//                 <MenuItem value="labour">{t("reports.labourReport")}</MenuItem>
//                 <MenuItem value="farmer">{t("reports.farmerReport")}</MenuItem>
//                 <MenuItem value="project">{t("reports.projectReport")}</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth>
//               <InputLabel id="selected-id-label">{t("common.select")}</InputLabel>
//               <Select
//                 labelId="selected-id-label"
//                 id="selected-id"
//                 value={selectedId}
//                 label={t("common.select")}
//                 onChange={handleSelectedIdChange}
//               >
//                 {reportType === "labour" &&
//                   labours.map((labour) => (
//                     <MenuItem key={labour._id} value={labour._id}>
//                       {labour.name}
//                     </MenuItem>
//                   ))}
//                 {reportType === "farmer" &&
//                   farmers.map((farmer) => (
//                     <MenuItem key={farmer._id} value={farmer._id}>
//                       {farmer.name}
//                     </MenuItem>
//                   ))}
//                 {reportType === "project" &&
//                   projects.map((project) => (
//                     <MenuItem key={project._id} value={project._id}>
//                       {project.name}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label={t("reports.startDate")}
//                 value={startDate}
//                 onChange={(newValue) => setStartDate(newValue)}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label={t("reports.endDate")}
//                 value={endDate}
//                 onChange={(newValue) => setEndDate(newValue)}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<BarChartIcon />}
//               onClick={generateReport}
//               disabled={!selectedId || !startDate || !endDate}
//               sx={{ height: "56px" }}
//             >
//               {t("reports.generateReport")}
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : reportData ? (
//         <Paper sx={{ borderRadius: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//             <Typography variant="h6">
//               {reportType === "labour"
//                 ? `${t("reports.labourReport")}: ${reportData.labour.name}`
//                 : reportType === "farmer"
//                   ? `${t("reports.farmerReport")}: ${reportData.farmer.name}`
//                   : `${t("reports.projectReport")}: ${reportData.project.name}`}
//             </Typography>
//             <Button startIcon={<PdfIcon />} onClick={exportPDF}>
//               {t("reports.exportPDF")}
//             </Button>
//           </Box>
//           <Divider />

//           <Box sx={{ p: 3 }}>
//             {renderSummary()}

//             <Box sx={{ mt: 4 }}>
//               {isMobile ? (
//                 renderMobileView()
//               ) : (
//                 <>
//                   <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
//                     <Tab label={t("reports.summary")} />
//                     <Tab label={t("reports.details")} />
//                   </Tabs>

//                   <Box sx={{ mt: 2 }}>
//                     {tabValue === 0 ? (
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}>
//                           {renderAttendanceChart()}
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           {reportType === "project"
//                             ? renderLabourChart()
//                             : reportType === "labour" || reportType === "farmer"
//                               ? renderProjectChart()
//                               : null}
//                         </Grid>
//                       </Grid>
//                     ) : (
//                       renderAttendanceDetails()
//                     )}
//                   </Box>
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Paper>
//       ) : null}
//     </Box>
//   )
// }

// export default Reports



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CardActionArea,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  PictureAsPdf as PdfIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Reports = () => {
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(0)
  const [reportType, setReportType] = useState<"labour" | "farmer" | "project">("labour")
  const [selectedId, setSelectedId] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [labours, setLabours] = useState<any[]>([])
  const [farmers, setFarmers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")) // Detects mobile view (xs breakpoint)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  useEffect(() => {
    fetchLabours()
    fetchFarmers()
    fetchProjects()
  }, [])

  const fetchLabours = async () => {
    try {
      const response = await api.get("/labours")
      setLabours(response.data.data)
    } catch (error) {
      console.error("Error fetching labours:", error)
    }
  }

  const fetchFarmers = async () => {
    try {
      const response = await api.get("/farmers")
      setFarmers(response.data.data)
    } catch (error) {
      console.error("Error fetching farmers:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects")
      setProjects(response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleReportTypeChange = (event: any) => {
    setReportType(event.target.value)
    setSelectedId("")
    setReportData(null)
  }

  const handleSelectedIdChange = (event: any) => {
    setSelectedId(event.target.value)
  }

  const generateReport = async () => {
    if (!selectedId || !startDate || !endDate) return

    try {
      setLoading(true)
      const formattedStartDate = startDate.toISOString().split("T")[0]
      const formattedEndDate = endDate.toISOString().split("T")[0]

      let response
      if (reportType === "labour") {
        response = await api.get(
          `/attendance/summary/labour/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        )
      } else if (reportType === "farmer") {
        response = await api.get(
          `/attendance/summary/farmer/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        )
      } else if (reportType === "project") {
        response = await api.get(
          `/attendance/summary/project/${selectedId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        )
      }

      setReportData(response?.data.data)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    alert("PDF export functionality would be implemented here")
  }

  const renderAttendanceChart = () => {
    if (!reportData) return null

    const chartData = [
      {
        name: t("reports.presentDays"),
        value: reportData.summary.presentDays,
      },
      {
        name: t("reports.absentDays"),
        value: reportData.summary.absentDays,
      },
    ]

    return (
      <Box sx={{ height: 300, width: "100%" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    )
  }

  const renderProjectChart = () => {
    if (!reportData || !reportData.projectSummary || reportData.projectSummary.length === 0) return null

    const chartData = reportData.projectSummary.map((project: any) => ({
      name: project.project.name,
      wages: project.totalWages,
      days: project.presentDays,
    }))

    return (
      <Box sx={{ height: 300, width: "100%" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
            <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    )
  }

  const renderLabourChart = () => {
    if (!reportData || !reportData.labourSummary || reportData.labourSummary.length === 0) return null

    const chartData = reportData.labourSummary.map((labour: any) => ({
      name: labour.labour.name,
      wages: labour.totalWages,
      days: labour.presentDays,
    }))

    return (
      <Box sx={{ height: 300, width: "100%" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="wages" name={t("reports.totalWages")} fill="#8884d8" />
            <Bar yAxisId="right" dataKey="days" name={t("reports.presentDays")} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    )
  }

  const renderSummary = () => {
    if (!reportData) return null

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t("reports.totalDays")}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {reportData.summary.totalDays}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t("reports.presentDays")}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {reportData.summary.presentDays}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t("reports.absentDays")}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {reportData.summary.absentDays}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t("reports.totalWages")}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                ₹{reportData.summary.totalWages.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const renderAttendanceDetails = () => {
    if (!reportData || !reportData.attendances || reportData.attendances.length === 0) return null

    if (isMobile) {
      return (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {reportData.attendances.map((attendance: any) => (
              <Grid item xs={12} key={attendance._id}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {new Date(attendance.date).toLocaleDateString()}
                    </Typography>
                    {reportType !== "labour" && (
                      <Typography variant="body2" color="text.secondary">
                        {t("attendance.labour")}: {attendance.labour.name}
                      </Typography>
                    )}
                    {reportType !== "project" && (
                      <Typography variant="body2" color="text.secondary">
                        {t("attendance.project")}: {attendance.project.name}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        {t("attendance.isPresent")}:
                      </Typography>
                      <Chip
                        label={attendance.isPresent ? t("common.yes") : t("common.no")}
                        color={attendance.isPresent ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("attendance.workHours")}: {attendance.workHours || "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("attendance.wages")}: ₹{attendance.wages.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("attendance.date")}</TableCell>
              {reportType !== "labour" && <TableCell>{t("attendance.labour")}</TableCell>}
              {reportType !== "project" && <TableCell>{t("attendance.project")}</TableCell>}
              <TableCell align="center">{t("attendance.isPresent")}</TableCell>
              <TableCell align="center">{t("attendance.workHours")}</TableCell>
              <TableCell align="right">{t("attendance.wages")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.attendances.map((attendance: any) => (
              <TableRow key={attendance._id}>
                <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                {reportType !== "labour" && <TableCell>{attendance.labour.name}</TableCell>}
                {reportType !== "project" && <TableCell>{attendance.project.name}</TableCell>}
                <TableCell align="center">
                  <Chip
                    label={attendance.isPresent ? t("common.yes") : t("common.no")}
                    color={attendance.isPresent ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{attendance.workHours || "-"}</TableCell>
                <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const renderMobileView = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 2,
                border: tabValue === 0 ? `2px solid ${theme.palette.primary.main}` : "none",
              }}
            >
              <CardActionArea onClick={() => setTabValue(0)}>
                <CardContent>
                  <Typography variant="h6">{t("reports.summary")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("reports.summaryDescription")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 2,
                border: tabValue === 1 ? `2px solid ${theme.palette.primary.main}` : "none",
              }}
            >
              <CardActionArea onClick={() => setTabValue(1)}>
                <CardContent>
                  <Typography variant="h6">{t("reports.details")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("reports.detailsDescription")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          {tabValue === 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {renderAttendanceChart()}
              </Grid>
              <Grid item xs={12}>
                {reportType === "project"
                  ? renderLabourChart()
                  : reportType === "labour" || reportType === "farmer"
                    ? renderProjectChart()
                    : null}
              </Grid>
            </Grid>
          ) : (
            renderAttendanceDetails()
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title={t("navigation.reports")} />

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">{t("common.select")}</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label={t("common.select")}
                onChange={handleReportTypeChange}
                startAdornment={
                  reportType === "labour" ? (
                    <PersonIcon sx={{ mr: 1 }} />
                  ) : reportType === "farmer" ? (
                    <AgricultureIcon sx={{ mr: 1 }} />
                  ) : (
                    <AssignmentIcon sx={{ mr: 1 }} />
                  )
                }
              >
                <MenuItem value="labour">{t("reports.labourReport")}</MenuItem>
                <MenuItem value="farmer">{t("reports.farmerReport")}</MenuItem>
                <MenuItem value="project">{t("reports.projectReport")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="selected-id-label">{t("common.select")}</InputLabel>
              <Select
                labelId="selected-id-label"
                id="selected-id"
                value={selectedId}
                label={t("common.select")}
                onChange={handleSelectedIdChange}
              >
                {reportType === "labour" &&
                  labours.map((labour) => (
                    <MenuItem key={labour._id} value={labour._id}>
                      {labour.name}
                    </MenuItem>
                  ))}
                {reportType === "farmer" &&
                  farmers.map((farmer) => (
                    <MenuItem key={farmer._id} value={farmer._id}>
                      {farmer.name}
                    </MenuItem>
                  ))}
                {reportType === "project" &&
                  projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t("reports.startDate")}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t("reports.endDate")}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<BarChartIcon />}
              onClick={generateReport}
              disabled={!selectedId || !startDate || !endDate}
              sx={{ height: "56px" }}
            >
              {t("reports.generateReport")}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : reportData ? (
        <Paper sx={{ borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h6">
              {reportType === "labour"
                ? `${t("reports.labourReport")}: ${reportData.labour.name}`
                : reportType === "farmer"
                  ? `${t("reports.farmerReport")}: ${reportData.farmer.name}`
                  : `${t("reports.projectReport")}: ${reportData.project.name}`}
            </Typography>
            <Button startIcon={<PdfIcon />} onClick={exportPDF}>
              {t("reports.exportPDF")}
            </Button>
          </Box>
          <Divider />

          <Box sx={{ p: 3 }}>
            {renderSummary()}

            <Box sx={{ mt: 4 }}>
              {isMobile ? (
                renderMobileView()
              ) : (
                <>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
                    <Tab label={t("reports.summary")} />
                    <Tab label={t("reports.details")} />
                  </Tabs>

                  <Box sx={{ mt: 2 }}>
                    {tabValue === 0 ? (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          {renderAttendanceChart()}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {reportType === "project"
                            ? renderLabourChart()
                            : reportType === "labour" || reportType === "farmer"
                              ? renderProjectChart()
                              : null}
                        </Grid>
                      </Grid>
                    ) : (
                      renderAttendanceDetails()
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      ) : null}
    </Box>
  )
}

export default Reports