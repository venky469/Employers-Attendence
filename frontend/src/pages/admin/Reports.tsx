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
//   People as PeopleIcon,
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
//   LineChart,
//   Line,
// } from "recharts"

// const AdminReports = () => {
//   const { t } = useTranslation()
//   const [tabValue, setTabValue] = useState(0)
//   const [reportType, setReportType] = useState<"labour" | "farmer" | "project" | "teamLead">("teamLead")
//   const [selectedId, setSelectedId] = useState<string>("")
//   const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)))
//   const [endDate, setEndDate] = useState<Date | null>(new Date())
//   const [loading, setLoading] = useState(false)
//   const [reportData, setReportData] = useState<any>(null)
//   const [labours, setLabours] = useState<any[]>([])
//   const [farmers, setFarmers] = useState<any[]>([])
//   const [projects, setProjects] = useState<any[]>([])
//   const [teamLeads, setTeamLeads] = useState<any[]>([])
//   const [overviewData, setOverviewData] = useState<any>(null)
//   const [loadingOverview, setLoadingOverview] = useState(true)

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

//   useEffect(() => {
//     fetchLabours()
//     fetchFarmers()
//     fetchProjects()
//     fetchTeamLeads()
//     fetchOverviewData()
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

//   const fetchTeamLeads = async () => {
//     try {
//       const response = await api.get("/users")
//       // Filter only team leads
//       setTeamLeads(response.data.data.filter((user: any) => user.role === "teamLead"))
//     } catch (error) {
//       console.error("Error fetching team leads:", error)
//     }
//   }

//   const fetchOverviewData = async () => {
//     try {
//       setLoadingOverview(true)
//       // In a real app, you would have an API endpoint for this
//       // For now, we'll simulate it with existing data

//       // Get attendance data for the last 30 days
//       const thirtyDaysAgo = new Date()
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//       const formattedStartDate = thirtyDaysAgo.toISOString().split("T")[0]
//       const formattedEndDate = new Date().toISOString().split("T")[0]

//       const attendanceResponse = await api.get(
//         `/attendance?date[gte]=${formattedStartDate}&date[lte]=${formattedEndDate}T23:59:59.999Z`,
//       )

//       // Process data for charts
//       const attendanceData = attendanceResponse.data.data

//       // Daily attendance count
//       const dailyAttendance = {}
//       attendanceData.forEach((attendance: any) => {
//         const date = new Date(attendance.date).toISOString().split("T")[0]
//         if (!dailyAttendance[date]) {
//           dailyAttendance[date] = { date, count: 0, present: 0, absent: 0 }
//         }
//         dailyAttendance[date].count++
//         if (attendance.isPresent) {
//           dailyAttendance[date].present++
//         } else {
//           dailyAttendance[date].absent++
//         }
//       })

//       // Project type distribution
//       const projectTypes = {}
//       projects.forEach((project: any) => {
//         if (!projectTypes[project.type]) {
//           projectTypes[project.type] = 0
//         }
//         projectTypes[project.type]++
//       })

//       // Team lead performance
//       const teamLeadPerformance = {}
//       attendanceData.forEach((attendance: any) => {
//         const teamLeadId = attendance.teamLead._id
//         if (!teamLeadPerformance[teamLeadId]) {
//           teamLeadPerformance[teamLeadId] = {
//             name: attendance.teamLead.name,
//             total: 0,
//             present: 0,
//             wages: 0,
//           }
//         }
//         teamLeadPerformance[teamLeadId].total++
//         if (attendance.isPresent) {
//           teamLeadPerformance[teamLeadId].present++
//           teamLeadPerformance[teamLeadId].wages += attendance.wages
//         }
//       })

//       setOverviewData({
//         dailyAttendance: Object.values(dailyAttendance),
//         projectTypes: Object.entries(projectTypes).map(([name, value]) => ({ name, value })),
//         teamLeadPerformance: Object.values(teamLeadPerformance),
//         totalAttendance: attendanceData.length,
//         presentCount: attendanceData.filter((a: any) => a.isPresent).length,
//         absentCount: attendanceData.filter((a: any) => !a.isPresent).length,
//         totalWages: attendanceData.reduce((sum: number, a: any) => sum + a.wages, 0),
//       })
//     } catch (error) {
//       console.error("Error fetching overview data:", error)
//     } finally {
//       setLoadingOverview(false)
//     }
//   }

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
//       } else if (reportType === "teamLead") {
//         // In a real app, you would have an API endpoint for team lead reports
//         // For now, we'll simulate it by filtering attendance data
//         const attendanceResponse = await api.get(
//           `/attendance?teamLead=${selectedId}&date[gte]=${formattedStartDate}&date[lte]=${formattedEndDate}T23:59:59.999Z`,
//         )

//         const attendances = attendanceResponse.data.data
//         const teamLead = teamLeads.find((tl) => tl._id === selectedId)

//         // Calculate summary
//         const totalLabours = new Set(attendances.map((a: any) => a.labour._id)).size
//         const totalDays = attendances.length
//         const presentDays = attendances.filter((a: any) => a.isPresent).length
//         const totalWages = attendances.reduce((sum: number, a: any) => sum + a.wages, 0)

//         // Group by project
//         const projectSummary = {}
//         attendances.forEach((a: any) => {
//           const projectId = a.project._id
//           if (!projectSummary[projectId]) {
//             projectSummary[projectId] = {
//               project: a.project,
//               totalDays: 0,
//               presentDays: 0,
//               totalWages: 0,
//               labours: new Set(),
//             }
//           }

//           projectSummary[projectId].totalDays++
//           if (a.isPresent) projectSummary[projectId].presentDays++
//           projectSummary[projectId].totalWages += a.wages
//           projectSummary[projectId].labours.add(a.labour._id)
//         })

//         // Convert Sets to counts
//         Object.values(projectSummary).forEach((project: any) => {
//           project.totalLabours = project.labours.size
//           delete project.labours
//         })

//         response = {
//           data: {
//             teamLead,
//             summary: {
//               totalLabours,
//               totalDays,
//               presentDays,
//               absentDays: totalDays - presentDays,
//               attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
//               totalWages,
//             },
//             projectSummary: Object.values(projectSummary),
//             attendances,
//           },
//         }
//       }

//       setReportData(response?.data.data)
//     } catch (error) {
//       console.error("Error generating report:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const exportPDF = () => {
//     // In a real app, this would generate and download a PDF
//     alert("PDF export functionality would be implemented here")
//   }

//   const renderOverviewCharts = () => {
//     if (!overviewData) return null

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: "100%", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Daily Attendance (Last 30 Days)
//               </Typography>
//               <Box sx={{ height: 300, width: "100%" }}>
//                 <ResponsiveContainer>
//                   <LineChart data={overviewData.dailyAttendance.slice(-14)}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="present" stroke="#4CAF50" name="Present" />
//                     <Line type="monotone" dataKey="absent" stroke="#F44336" name="Absent" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: "100%", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Project Types
//               </Typography>
//               <Box sx={{ height: 300, width: "100%" }}>
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={overviewData.projectTypes}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {overviewData.projectTypes.map((_entry: any, index: number) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Team Lead Performance
//               </Typography>
//               <Box sx={{ height: 300, width: "100%" }}>
//                 <ResponsiveContainer>
//                   <BarChart data={overviewData.teamLeadPerformance}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//                     <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
//                     <Tooltip />
//                     <Legend />
//                     <Bar yAxisId="left" dataKey="present" name="Attendance Count" fill="#8884d8" />
//                     <Bar yAxisId="right" dataKey="wages" name="Total Wages (₹)" fill="#82ca9d" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     )
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
//               {chartData.map((_entry, index) => (
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

//   return (
//     <Box>
//       <PageHeader title={t("navigation.reports")} />

//       <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs" sx={{ mb: 3 }}>
//         <Tab label="Overview" />
//         <Tab label="Detailed Reports" />
//       </Tabs>

//       {tabValue === 0 ? (
//         // Overview Tab
//         <Box>
//           <Grid container spacing={3} sx={{ mb: 3 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     {t("dashboard.totalTeamLeads")}
//                   </Typography>
//                   <Typography variant="h4" component="div" fontWeight="bold">
//                     {teamLeads.length}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     {t("dashboard.totalLabours")}
//                   </Typography>
//                   <Typography variant="h4" component="div" fontWeight="bold">
//                     {labours.length}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     {t("dashboard.totalFarmers")}
//                   </Typography>
//                   <Typography variant="h4" component="div" fontWeight="bold">
//                     {farmers.length}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     {t("dashboard.totalProjects")}
//                   </Typography>
//                   <Typography variant="h4" component="div" fontWeight="bold">
//                     {projects.length}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {loadingOverview ? (
//             <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             renderOverviewCharts()
//           )}
//         </Box>
//       ) : (
//         // Detailed Reports Tab
//         <Box>
//           <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth>
//                   <InputLabel id="report-type-label">{t("common.select")}</InputLabel>
//                   <Select
//                     labelId="report-type-label"
//                     id="report-type"
//                     value={reportType}
//                     label={t("common.select")}
//                     onChange={handleReportTypeChange}
//                     startAdornment={
//                       reportType === "labour" ? (
//                         <PersonIcon sx={{ mr: 1 }} />
//                       ) : reportType === "farmer" ? (
//                         <AgricultureIcon sx={{ mr: 1 }} />
//                       ) : reportType === "teamLead" ? (
//                         <PeopleIcon sx={{ mr: 1 }} />
//                       ) : (
//                         <AssignmentIcon sx={{ mr: 1 }} />
//                       )
//                     }
//                   >
//                     <MenuItem value="teamLead">Team Lead Report</MenuItem>
//                     <MenuItem value="labour">{t("reports.labourReport")}</MenuItem>
//                     <MenuItem value="farmer">{t("reports.farmerReport")}</MenuItem>
//                     <MenuItem value="project">{t("reports.projectReport")}</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <FormControl fullWidth>
//                   <InputLabel id="selected-id-label">{t("common.select")}</InputLabel>
//                   <Select
//                     labelId="selected-id-label"
//                     id="selected-id"
//                     value={selectedId}
//                     label={t("common.select")}
//                     onChange={handleSelectedIdChange}
//                   >
//                     {reportType === "labour" &&
//                       labours.map((labour) => (
//                         <MenuItem key={labour._id} value={labour._id}>
//                           {labour.name}
//                         </MenuItem>
//                       ))}
//                     {reportType === "farmer" &&
//                       farmers.map((farmer) => (
//                         <MenuItem key={farmer._id} value={farmer._id}>
//                           {farmer.name}
//                         </MenuItem>
//                       ))}
//                     {reportType === "project" &&
//                       projects.map((project) => (
//                         <MenuItem key={project._id} value={project._id}>
//                           {project.name}
//                         </MenuItem>
//                       ))}
//                     {reportType === "teamLead" &&
//                       teamLeads.map((teamLead) => (
//                         <MenuItem key={teamLead._id} value={teamLead._id}>
//                           {teamLead.name}
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={2}>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label={t("reports.startDate")}
//                     value={startDate}
//                     onChange={(newValue) => setStartDate(newValue)}
//                     slotProps={{ textField: { fullWidth: true } }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//               <Grid item xs={12} sm={6} md={2}>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label={t("reports.endDate")}
//                     value={endDate}
//                     onChange={(newValue) => setEndDate(newValue)}
//                     slotProps={{ textField: { fullWidth: true } }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//               <Grid item xs={12} md={2}>
//                 <Button
//                   variant="contained"
//                   fullWidth
//                   startIcon={<BarChartIcon />}
//                   onClick={generateReport}
//                   disabled={!selectedId || !startDate || !endDate}
//                   sx={{ height: "56px" }}
//                 >
//                   {t("reports.generateReport")}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>

//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : reportData ? (
//             <Paper sx={{ borderRadius: 2 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//                 <Typography variant="h6">
//                   {reportType === "labour"
//                     ? `${t("reports.labourReport")}: ${reportData.labour.name}`
//                     : reportType === "farmer"
//                       ? `${t("reports.farmerReport")}: ${reportData.farmer.name}`
//                       : reportType === "teamLead"
//                         ? `Team Lead Report: ${reportData.teamLead.name}`
//                         : `${t("reports.projectReport")}: ${reportData.project.name}`}
//                 </Typography>
//                 <Button startIcon={<PdfIcon />} onClick={exportPDF}>
//                   {t("reports.exportPDF")}
//                 </Button>
//               </Box>
//               <Divider />

//               <Box sx={{ p: 3 }}>
//                 {renderSummary()}

//                 <Box sx={{ mt: 4 }}>
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
//                             : reportType === "labour" || reportType === "farmer" || reportType === "teamLead"
//                               ? renderProjectChart()
//                               : null}
//                         </Grid>
//                       </Grid>
//                     ) : (
//                       renderAttendanceDetails()
//                     )}
//                   </Box>
//                 </Box>
//               </Box>
//             </Paper>
//           ) : null}
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default AdminReports





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
  People as PeopleIcon,
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
  LineChart,
  Line,
} from "recharts"

// Define interfaces for the objects
interface DailyAttendance {
  [key: string]: {
    date: string;
    count: number;
    present: number;
    absent: number;
  };
}

interface TeamLeadPerformance {
  [key: string]: {
    name: string;
    total: number;
    present: number;
    wages: number;
  };
}

interface ProjectSummary {
  [key: string]: {
    project: any;
    totalDays: number;
    presentDays: number;
    totalWages: number;
    labours: Set<string>;
  };
}

const AdminReports = () => {
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(0)
  const [reportType, setReportType] = useState<"labour" | "farmer" | "project" | "teamLead">("teamLead")
  const [selectedId, setSelectedId] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [labours, setLabours] = useState<any[]>([])
  const [farmers, setFarmers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [teamLeads, setTeamLeads] = useState<any[]>([])
  const [overviewData, setOverviewData] = useState<any>(null)
  const [loadingOverview, setLoadingOverview] = useState(true)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  useEffect(() => {
    fetchLabours()
    fetchFarmers()
    fetchProjects()
    fetchTeamLeads()
    fetchOverviewData()
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

  const fetchTeamLeads = async () => {
    try {
      const response = await api.get("/users")
      // Filter only team leads
      setTeamLeads(response.data.data.filter((user: any) => user.role === "teamLead"))
    } catch (error) {
      console.error("Error fetching team leads:", error)
    }
  }

  const fetchOverviewData = async () => {
    try {
      setLoadingOverview(true)
      // In a real app, you would have an API endpoint for this
      // For now, we'll simulate it with existing data

      // Get attendance data for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const formattedStartDate = thirtyDaysAgo.toISOString().split("T")[0]
      const formattedEndDate = new Date().toISOString().split("T")[0]

      const attendanceResponse = await api.get(
        `/attendance?date[gte]=${formattedStartDate}&date[lte]=${formattedEndDate}T23:59:59.999Z`,
      )

      // Process data for charts
      const attendanceData = attendanceResponse.data.data

      // Daily attendance count
      const dailyAttendance: DailyAttendance = {}
      attendanceData.forEach((attendance: any) => {
        const date = new Date(attendance.date).toISOString().split("T")[0]
        if (!dailyAttendance[date]) {
          dailyAttendance[date] = { date, count: 0, present: 0, absent: 0 }
        }
        dailyAttendance[date].count++
        if (attendance.isPresent) {
          dailyAttendance[date].present++
        } else {
          dailyAttendance[date].absent++
        }
      })

      // Project type distribution
      const projectTypes: { [key: string]: number } = {}
      projects.forEach((project: any) => {
        if (!projectTypes[project.type]) {
          projectTypes[project.type] = 0
        }
        projectTypes[project.type]++
      })

      // Team lead performance
      const teamLeadPerformance: TeamLeadPerformance = {}
      attendanceData.forEach((attendance: any) => {
        const teamLeadId = attendance.teamLead._id
        if (!teamLeadPerformance[teamLeadId]) {
          teamLeadPerformance[teamLeadId] = {
            name: attendance.teamLead.name,
            total: 0,
            present: 0,
            wages: 0,
          }
        }
        teamLeadPerformance[teamLeadId].total++
        if (attendance.isPresent) {
          teamLeadPerformance[teamLeadId].present++
          teamLeadPerformance[teamLeadId].wages += attendance.wages
        }
      })

      setOverviewData({
        dailyAttendance: Object.values(dailyAttendance),
        projectTypes: Object.entries(projectTypes).map(([name, value]) => ({ name, value })),
        teamLeadPerformance: Object.values(teamLeadPerformance),
        totalAttendance: attendanceData.length,
        presentCount: attendanceData.filter((a: any) => a.isPresent).length,
        absentCount: attendanceData.filter((a: any) => !a.isPresent).length,
        totalWages: attendanceData.reduce((sum: number, a: any) => sum + a.wages, 0),
      })
    } catch (error) {
      console.error("Error fetching overview data:", error)
    } finally {
      setLoadingOverview(false)
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
      } else if (reportType === "teamLead") {
        // In a real app, you would have an API endpoint for team lead reports
        // For now, we'll simulate it by filtering attendance data
        const attendanceResponse = await api.get(
          `/attendance?teamLead=${selectedId}&date[gte]=${formattedStartDate}&date[lte]=${formattedEndDate}T23:59:59.999Z`,
        )

        const attendances = attendanceResponse.data.data
        const teamLead = teamLeads.find((tl) => tl._id === selectedId)

        // Calculate summary
        const totalLabours = new Set(attendances.map((a: any) => a.labour._id)).size
        const totalDays = attendances.length
        const presentDays = attendances.filter((a: any) => a.isPresent).length
        const totalWages = attendances.reduce((sum: number, a: any) => sum + a.wages, 0)

        // Group by project
        const projectSummary: ProjectSummary = {}
        attendances.forEach((a: any) => {
          const projectId = a.project._id
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
          projectSummary[projectId].labours.add(a.labour._id)
        })

        // Convert Sets to counts
        Object.values(projectSummary).forEach((project: any) => {
          project.totalLabours = project.labours.size
          delete project.labours
        })

        response = {
          data: {
            teamLead,
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
        }
      }

      setReportData(response?.data.data)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert("PDF export functionality would be implemented here")
  }

  const renderOverviewCharts = () => {
    if (!overviewData) return null

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Attendance (Last 30 Days)
              </Typography>
              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer>
                  <LineChart data={overviewData.dailyAttendance.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#4CAF50" name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#F44336" name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Types
              </Typography>
              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={overviewData.projectTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {overviewData.projectTypes.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Lead Performance
              </Typography>
              <Box sx={{ height: 300, width: "100%" }}>
                <ResponsiveContainer>
                  <BarChart data={overviewData.teamLeadPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="present" name="Attendance Count" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="wages" name="Total Wages (₹)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
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

  return (
    <Box>
      <PageHeader title={t("navigation.reports")} />

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs" sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Detailed Reports" />
      </Tabs>

      {tabValue === 0 ? (
        // Overview Tab
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t("dashboard.totalTeamLeads")}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {teamLeads.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t("dashboard.totalLabours")}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {labours.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t("dashboard.totalFarmers")}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {farmers.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t("dashboard.totalProjects")}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {projects.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {loadingOverview ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderOverviewCharts()
          )}
        </Box>
      ) : (
        // Detailed Reports Tab
        <Box>
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
                      ) : reportType === "teamLead" ? (
                        <PeopleIcon sx={{ mr: 1 }} />
                      ) : (
                        <AssignmentIcon sx={{ mr: 1 }} />
                      )
                    }
                  >
                    <MenuItem value="teamLead">Team Lead Report</MenuItem>
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
                    {reportType === "teamLead" &&
                      teamLeads.map((teamLead) => (
                        <MenuItem key={teamLead._id} value={teamLead._id}>
                          {teamLead.name}
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
                      : reportType === "teamLead"
                        ? `Team Lead Report: ${reportData.teamLead.name}`
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
                            : reportType === "labour" || reportType === "farmer" || reportType === "teamLead"
                              ? renderProjectChart()
                              : null}
                        </Grid>
                      </Grid>
                    ) : (
                      renderAttendanceDetails()
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          ) : null}
        </Box>
      )}
    </Box>
  )
}

export default AdminReports