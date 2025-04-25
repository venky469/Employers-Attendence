// // "use client"

// // import type React from "react"

// // import { useState, useEffect } from "react"
// // import { useTranslation } from "react-i18next"
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Button,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   TextField,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Grid,
// //   IconButton,
// //   FormHelperText,
// //   CircularProgress,
// //   Snackbar,
// //   Alert,
// //   Tabs,
// //   Tab,
// //   Checkbox,
// //   FormControlLabel,
// //   TableContainer,
// //   Table,
// //   TableHead,
// //   TableBody,
// //   TableRow,
// //   TableCell,
// //   TablePagination,
// // } from "@mui/material"
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
// // import {
// //   Add as AddIcon,
// //   Edit as EditIcon,
// //   Delete as DeleteIcon,
// //   CheckCircle as CheckCircleIcon,
// //   Cancel as CancelIcon,
// //   Group as GroupIcon,
// // } from "@mui/icons-material"
// // import { useFormik } from "formik"
// // import * as Yup from "yup"
// // import { api } from "../../utils/api"
// // import PageHeader from "../../components/common/PageHeader"
// // import ConfirmDialog from "../../components/common/ConfirmDialog"
// // import LoadingButton from "../../components/common/LoadingButton"

// // const Attendance = () => {
// //   const { t } = useTranslation()
// //   const [attendances, setAttendances] = useState<any[]>([])
// //   const [labours, setLabours] = useState<any[]>([])
// //   const [projects, setProjects] = useState<any[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [openDialog, setOpenDialog] = useState(false)
// //   const [openBulkDialog, setOpenBulkDialog] = useState(false)
// //   const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
// //   const [currentAttendance, setCurrentAttendance] = useState<any>(null)
// //   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
// //   const [attendanceToDelete, setAttendanceToDelete] = useState<string | null>(null)
// //   const [tabValue, setTabValue] = useState(0)
// //   const [page, setPage] = useState(0)
// //   const [rowsPerPage, setRowsPerPage] = useState(10)
// //   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
// //   const [selectedLabours, setSelectedLabours] = useState<string[]>([])
// //   const [selectedProject, setSelectedProject] = useState<string>("")
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success" as "success" | "error",
// //   })

// //   const validationSchema = Yup.object({
// //     date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
// //     labour: Yup.string().required(t("attendance.labour") + " " + t("common.error")),
// //     project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
// //     isPresent: Yup.boolean().required(),
// //     workHours: Yup.number().min(0).max(24).nullable(),
// //     remarks: Yup.string(),
// //   })

// //   const formik = useFormik({
// //     initialValues: {
// //       date: new Date(),
// //       labour: "",
// //       project: "",
// //       isPresent: true,
// //       workHours: 8,
// //       remarks: "",
// //     },
// //     validationSchema,
// //     onSubmit: async (values) => {
// //       try {
// //         const formData = {
// //           ...values,
// //           date: values.date.toISOString(),
// //         }

// //         if (dialogMode === "add") {
// //           await api.post("/attendance", formData)
// //           setSnackbar({
// //             open: true,
// //             message: t("attendance.addSuccess"),
// //             severity: "success",
// //           })
// //         } else {
// //           await api.put(`/attendance/${currentAttendance._id}`, formData)
// //           setSnackbar({
// //             open: true,
// //             message: t("attendance.updateSuccess"),
// //             severity: "success",
// //           })
// //         }

// //         fetchAttendances()
// //         handleCloseDialog()
// //       } catch (error) {
// //         console.error("Error saving attendance:", error)
// //         setSnackbar({
// //           open: true,
// //           message: "Error saving attendance",
// //           severity: "error",
// //         })
// //       }
// //     },
// //   })

// //   const bulkAttendanceFormik = useFormik({
// //     initialValues: {
// //       date: new Date(),
// //       project: "",
// //       isPresent: true,
// //       workHours: 8,
// //       remarks: "",
// //     },
// //     validationSchema: Yup.object({
// //       date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
// //       project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
// //       isPresent: Yup.boolean().required(),
// //       workHours: Yup.number().min(0).max(24).nullable(),
// //       remarks: Yup.string(),
// //     }),
// //     onSubmit: async (values) => {
// //       try {
// //         if (selectedLabours.length === 0) {
// //           setSnackbar({
// //             open: true,
// //             message: "Please select at least one labour",
// //             severity: "error",
// //           })
// //           return
// //         }

// //         // In a real app, you would have a bulk attendance API endpoint
// //         // For now, we'll submit each attendance individually
// //         const promises = selectedLabours.map((labourId) =>
// //           api.post("/attendance", {
// //             ...values,
// //             labour: labourId,
// //             date: values.date.toISOString(),
// //           }),
// //         )

// //         await Promise.all(promises)

// //         setSnackbar({
// //           open: true,
// //           message: t("attendance.addSuccess"),
// //           severity: "success",
// //         })

// //         fetchAttendances()
// //         handleCloseBulkDialog()
// //       } catch (error) {
// //         console.error("Error saving bulk attendance:", error)
// //         setSnackbar({
// //           open: true,
// //           message: "Error saving bulk attendance",
// //           severity: "error",
// //         })
// //       }
// //     },
// //   })

// //   useEffect(() => {
// //     fetchAttendances()
// //     fetchLabours()
// //     fetchProjects()
// //   }, [])

// //   useEffect(() => {
// //     if (selectedDate) {
// //       fetchAttendances(selectedDate)
// //     }
// //   }, [selectedDate])

// //   const fetchAttendances = async (date = new Date()) => {
// //     try {
// //       setLoading(true)
// //       const formattedDate = date.toISOString().split("T")[0]
// //       const response = await api.get(`/attendance?date[gte]=${formattedDate}&date[lte]=${formattedDate}T23:59:59.999Z`)
// //       setAttendances(response.data.data)
// //     } catch (error) {
// //       console.error("Error fetching attendances:", error)
// //       setSnackbar({
// //         open: true,
// //         message: "Error fetching attendances",
// //         severity: "error",
// //       })
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const fetchLabours = async () => {
// //     try {
// //       const response = await api.get("/labours")
// //       setLabours(response.data.data)
// //     } catch (error) {
// //       console.error("Error fetching labours:", error)
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

// //   const handleOpenDialog = (mode: "add" | "edit", attendance?: any) => {
// //     setDialogMode(mode)
// //     if (mode === "edit" && attendance) {
// //       setCurrentAttendance(attendance)
// //       formik.setValues({
// //         date: new Date(attendance.date),
// //         labour: attendance.labour._id,
// //         project: attendance.project._id,
// //         isPresent: attendance.isPresent,
// //         workHours: attendance.workHours || 8,
// //         remarks: attendance.remarks || "",
// //       })
// //     } else {
// //       formik.resetForm()
// //       formik.setValues({
// //         ...formik.initialValues,
// //         date: selectedDate || new Date(),
// //       })
// //       setCurrentAttendance(null)
// //     }
// //     setOpenDialog(true)
// //   }

// //   const handleCloseDialog = () => {
// //     setOpenDialog(false)
// //     formik.resetForm()
// //   }

// //   const handleOpenBulkDialog = () => {
// //     setSelectedLabours([])
// //     setSelectedProject("")
// //     bulkAttendanceFormik.resetForm()
// //     bulkAttendanceFormik.setValues({
// //       ...bulkAttendanceFormik.initialValues,
// //       date: selectedDate || new Date(),
// //     })
// //     setOpenBulkDialog(true)
// //   }

// //   const handleCloseBulkDialog = () => {
// //     setOpenBulkDialog(false)
// //     setSelectedLabours([])
// //     setSelectedProject("")
// //     bulkAttendanceFormik.resetForm()
// //   }

// //   const handleDeleteAttendance = async () => {
// //     if (!attendanceToDelete) return

// //     try {
// //       await api.delete(`/attendance/${attendanceToDelete}`)
// //       setSnackbar({
// //         open: true,
// //         message: t("attendance.deleteSuccess"),
// //         severity: "success",
// //       })
// //       fetchAttendances(selectedDate || new Date())
// //     } catch (error) {
// //       console.error("Error deleting attendance:", error)
// //       setSnackbar({
// //         open: true,
// //         message: "Error deleting attendance",
// //         severity: "error",
// //       })
// //     } finally {
// //       setOpenConfirmDialog(false)
// //       setAttendanceToDelete(null)
// //     }
// //   }

// //   const handleChangePage = (event: unknown, newPage: number) => {
// //     setPage(newPage)
// //   }

// //   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setRowsPerPage(Number.parseInt(event.target.value, 10))
// //     setPage(0)
// //   }

// //   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
// //     setTabValue(newValue)
// //   }

// //   const handleLabourSelect = (labourId: string) => {
// //     setSelectedLabours((prev) => (prev.includes(labourId) ? prev.filter((id) => id !== labourId) : [...prev, labourId]))
// //   }

// //   const handleSelectAllLabours = () => {
// //     if (selectedLabours.length === labours.length) {
// //       setSelectedLabours([])
// //     } else {
// //       setSelectedLabours(labours.map((labour) => labour._id))
// //     }
// //   }

// //   return (
// //     <Box>
// //       <PageHeader
// //         title={t("navigation.attendance")}
// //         action={{
// //           text: t("attendance.markAttendance"),
// //           icon: <AddIcon />,
// //           onClick: () => handleOpenDialog("add"),
// //         }}
// //       />

// //       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //         <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}>
// //           <LocalizationProvider dateAdapter={AdapterDateFns}>
// //             <DatePicker
// //               label={t("attendance.date")}
// //               value={selectedDate}
// //               onChange={(newValue) => setSelectedDate(newValue)}
// //               slotProps={{ textField: { fullWidth: true, size: "small" } }}
// //               sx={{ flexGrow: 1 }}
// //             />
// //           </LocalizationProvider>
// //           <Button
// //             variant="outlined"
// //             startIcon={<GroupIcon />}
// //             onClick={handleOpenBulkDialog}
// //             sx={{ whiteSpace: "nowrap" }}
// //           >
// //             {t("attendance.bulkAttendance")}
// //           </Button>
// //         </Box>
// //       </Paper>

// //       <Paper sx={{ borderRadius: 2 }}>
// //         <Tabs
// //           value={tabValue}
// //           onChange={handleTabChange}
// //           aria-label="attendance tabs"
// //           sx={{ borderBottom: 1, borderColor: "divider" }}
// //         >
// //           <Tab label={t("common.all")} />
// //           <Tab label={t("common.yes")} />
// //           <Tab label={t("common.no")} />
// //         </Tabs>

// //         {loading ? (
// //           <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
// //             <CircularProgress />
// //           </Box>
// //         ) : attendances.length === 0 ? (
// //           <Box sx={{ p: 4, textAlign: "center" }}>
// //             <Typography variant="body1">{t("common.noData")}</Typography>
// //           </Box>
// //         ) : (
// //           <TableContainer>
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>{t("attendance.labour")}</TableCell>
// //                   <TableCell>{t("attendance.project")}</TableCell>
// //                   <TableCell align="center">{t("attendance.isPresent")}</TableCell>
// //                   <TableCell align="center">{t("attendance.workHours")}</TableCell>
// //                   <TableCell align="right">{t("attendance.wages")}</TableCell>
// //                   <TableCell>{t("attendance.remarks")}</TableCell>
// //                   <TableCell align="center">{t("common.actions")}</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {attendances
// //                   .filter((attendance) => {
// //                     if (tabValue === 1) return attendance.isPresent
// //                     if (tabValue === 2) return !attendance.isPresent
// //                     return true
// //                   })
// //                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //                   .map((attendance) => (
// //                     <TableRow key={attendance._id}>
// //                       <TableCell>
// //                         <Typography variant="body2" fontWeight="medium">
// //                           {attendance.labour.name}
// //                         </Typography>
// //                       </TableCell>
// //                       <TableCell>
// //                         <Typography variant="body2">{attendance.project.name}</Typography>
// //                         <Typography variant="caption" color="text.secondary">
// //                           {attendance.project.type}
// //                         </Typography>
// //                       </TableCell>
// //                       <TableCell align="center">
// //                         {attendance.isPresent ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
// //                       </TableCell>
// //                       <TableCell align="center">{attendance.workHours || "-"}</TableCell>
// //                       <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
// //                       <TableCell>{attendance.remarks || "-"}</TableCell>
// //                       <TableCell align="center">
// //                         <IconButton size="small" color="primary" onClick={() => handleOpenDialog("edit", attendance)}>
// //                           <EditIcon fontSize="small" />
// //                         </IconButton>
// //                         <IconButton
// //                           size="small"
// //                           color="error"
// //                           onClick={() => {
// //                             setAttendanceToDelete(attendance._id)
// //                             setOpenConfirmDialog(true)
// //                           }}
// //                         >
// //                           <DeleteIcon fontSize="small" />
// //                         </IconButton>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //               </TableBody>
// //             </Table>
// //             <TablePagination
// //               rowsPerPageOptions={[5, 10, 25]}
// //               component="div"
// //               count={
// //                 attendances.filter((attendance) => {
// //                   if (tabValue === 1) return attendance.isPresent
// //                   if (tabValue === 2) return !attendance.isPresent
// //                   return true
// //                 }).length
// //               }
// //               rowsPerPage={rowsPerPage}
// //               page={page}
// //               onPageChange={handleChangePage}
// //               onRowsPerPageChange={handleChangeRowsPerPage}
// //             />
// //           </TableContainer>
// //         )}
// //       </Paper>

// //       {/* Add/Edit Attendance Dialog */}
// //       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
// //         <form onSubmit={formik.handleSubmit}>
// //           <DialogTitle>
// //             {dialogMode === "add" ? t("attendance.markAttendance") : t("attendance.editAttendance")}
// //           </DialogTitle>
// //           <DialogContent dividers>
// //             <Grid container spacing={2}>
// //               <Grid item xs={12}>
// //                 <LocalizationProvider dateAdapter={AdapterDateFns}>
// //                   <DatePicker
// //                     label={t("attendance.date")}
// //                     value={formik.values.date}
// //                     onChange={(newValue) => formik.setFieldValue("date", newValue)}
// //                     slotProps={{
// //                       textField: {
// //                         fullWidth: true,
// //                         error: formik.touched.date && Boolean(formik.errors.date),
// //                         helperText: formik.touched.date && formik.errors.date,
// //                       },
// //                     }}
// //                   />
// //                 </LocalizationProvider>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth error={formik.touched.labour && Boolean(formik.errors.labour)}>
// //                   <InputLabel id="labour-label">{t("attendance.labour")}</InputLabel>
// //                   <Select
// //                     labelId="labour-label"
// //                     id="labour"
// //                     name="labour"
// //                     value={formik.values.labour}
// //                     label={t("attendance.labour")}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                   >
// //                     {labours.map((labour) => (
// //                       <MenuItem key={labour._id} value={labour._id}>
// //                         {labour.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                   {formik.touched.labour && formik.errors.labour && (
// //                     <FormHelperText>{formik.errors.labour}</FormHelperText>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth error={formik.touched.project && Boolean(formik.errors.project)}>
// //                   <InputLabel id="project-label">{t("attendance.project")}</InputLabel>
// //                   <Select
// //                     labelId="project-label"
// //                     id="project"
// //                     name="project"
// //                     value={formik.values.project}
// //                     label={t("attendance.project")}
// //                     onChange={formik.handleChange}
// //                     onBlur={formik.handleBlur}
// //                   >
// //                     {projects.map((project) => (
// //                       <MenuItem key={project._id} value={project._id}>
// //                         {project.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                   {formik.touched.project && formik.errors.project && (
// //                     <FormHelperText>{formik.errors.project}</FormHelperText>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth>
// //                   <InputLabel id="isPresent-label">{t("attendance.isPresent")}</InputLabel>
// //                   <Select
// //                     labelId="isPresent-label"
// //                     id="isPresent"
// //                     name="isPresent"
// //                     value={formik.values.isPresent}
// //                     label={t("attendance.isPresent")}
// //                     onChange={formik.handleChange}
// //                   >
// //                     <MenuItem value={true}>{t("common.yes")}</MenuItem>
// //                     <MenuItem value={false}>{t("common.no")}</MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   id="workHours"
// //                   name="workHours"
// //                   label={t("attendance.workHours")}
// //                   type="number"
// //                   value={formik.values.workHours}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.workHours && Boolean(formik.errors.workHours)}
// //                   helperText={formik.touched.workHours && formik.errors.workHours}
// //                   disabled={!formik.values.isPresent}
// //                   InputProps={{ inputProps: { min: 0, max: 24 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   id="remarks"
// //                   name="remarks"
// //                   label={t("attendance.remarks")}
// //                   value={formik.values.remarks}
// //                   onChange={formik.handleChange}
// //                   onBlur={formik.handleBlur}
// //                   error={formik.touched.remarks && Boolean(formik.errors.remarks)}
// //                   helperText={formik.touched.remarks && formik.errors.remarks}
// //                   multiline
// //                   rows={2}
// //                 />
// //               </Grid>
// //             </Grid>
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
// //             <LoadingButton
// //               loading={formik.isSubmitting}
// //               type="submit"
// //               variant="contained"
// //               disabled={!formik.isValid || formik.isSubmitting}
// //             >
// //               {t("common.save")}
// //             </LoadingButton>
// //           </DialogActions>
// //         </form>
// //       </Dialog>

// //       {/* Bulk Attendance Dialog */}
// //       <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="md" fullWidth>
// //         <form onSubmit={bulkAttendanceFormik.handleSubmit}>
// //           <DialogTitle>{t("attendance.bulkAttendance")}</DialogTitle>
// //           <DialogContent dividers>
// //             <Grid container spacing={2}>
// //               <Grid item xs={12}>
// //                 <LocalizationProvider dateAdapter={AdapterDateFns}>
// //                   <DatePicker
// //                     label={t("attendance.date")}
// //                     value={bulkAttendanceFormik.values.date}
// //                     onChange={(newValue) => bulkAttendanceFormik.setFieldValue("date", newValue)}
// //                     slotProps={{
// //                       textField: {
// //                         fullWidth: true,
// //                         error: bulkAttendanceFormik.touched.date && Boolean(bulkAttendanceFormik.errors.date),
// //                         helperText: bulkAttendanceFormik.touched.date && bulkAttendanceFormik.errors.date,
// //                       },
// //                     }}
// //                   />
// //                 </LocalizationProvider>
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <FormControl
// //                   fullWidth
// //                   error={bulkAttendanceFormik.touched.project && Boolean(bulkAttendanceFormik.errors.project)}
// //                 >
// //                   <InputLabel id="bulk-project-label">{t("attendance.project")}</InputLabel>
// //                   <Select
// //                     labelId="bulk-project-label"
// //                     id="project"
// //                     name="project"
// //                     value={bulkAttendanceFormik.values.project}
// //                     label={t("attendance.project")}
// //                     onChange={bulkAttendanceFormik.handleChange}
// //                     onBlur={bulkAttendanceFormik.handleBlur}
// //                   >
// //                     {projects.map((project) => (
// //                       <MenuItem key={project._id} value={project._id}>
// //                         {project.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                   {bulkAttendanceFormik.touched.project && bulkAttendanceFormik.errors.project && (
// //                     <FormHelperText>{bulkAttendanceFormik.errors.project}</FormHelperText>
// //                   )}
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <FormControl fullWidth>
// //                   <InputLabel id="bulk-isPresent-label">{t("attendance.isPresent")}</InputLabel>
// //                   <Select
// //                     labelId="bulk-isPresent-label"
// //                     id="isPresent"
// //                     name="isPresent"
// //                     value={bulkAttendanceFormik.values.isPresent}
// //                     label={t("attendance.isPresent")}
// //                     onChange={bulkAttendanceFormik.handleChange}
// //                   >
// //                     <MenuItem value={true}>{t("common.yes")}</MenuItem>
// //                     <MenuItem value={false}>{t("common.no")}</MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //               <Grid item xs={12} sm={6}>
// //                 <TextField
// //                   fullWidth
// //                   id="workHours"
// //                   name="workHours"
// //                   label={t("attendance.workHours")}
// //                   type="number"
// //                   value={bulkAttendanceFormik.values.workHours}
// //                   onChange={bulkAttendanceFormik.handleChange}
// //                   onBlur={bulkAttendanceFormik.handleBlur}
// //                   error={bulkAttendanceFormik.touched.workHours && Boolean(bulkAttendanceFormik.errors.workHours)}
// //                   helperText={bulkAttendanceFormik.touched.workHours && bulkAttendanceFormik.errors.workHours}
// //                   disabled={!bulkAttendanceFormik.values.isPresent}
// //                   InputProps={{ inputProps: { min: 0, max: 24 } }}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   fullWidth
// //                   id="remarks"
// //                   name="remarks"
// //                   label={t("attendance.remarks")}
// //                   value={bulkAttendanceFormik.values.remarks}
// //                   onChange={bulkAttendanceFormik.handleChange}
// //                   onBlur={bulkAttendanceFormik.handleBlur}
// //                   error={bulkAttendanceFormik.touched.remarks && Boolean(bulkAttendanceFormik.errors.remarks)}
// //                   helperText={bulkAttendanceFormik.touched.remarks && bulkAttendanceFormik.errors.remarks}
// //                   multiline
// //                   rows={2}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <Typography variant="subtitle1" gutterBottom>
// //                   {t("attendance.selectLabours")}
// //                 </Typography>
// //                 <FormControlLabel
// //                   control={
// //                     <Checkbox
// //                       checked={selectedLabours.length === labours.length}
// //                       indeterminate={selectedLabours.length > 0 && selectedLabours.length < labours.length}
// //                       onChange={handleSelectAllLabours}
// //                     />
// //                   }
// //                   label={t("common.all")}
// //                 />
// //                 <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1, border: 1, borderColor: "divider", p: 1 }}>
// //                   <Grid container spacing={1}>
// //                     {labours.map((labour) => (
// //                       <Grid item xs={12} sm={6} key={labour._id}>
// //                         <FormControlLabel
// //                           control={
// //                             <Checkbox
// //                               checked={selectedLabours.includes(labour._id)}
// //                               onChange={() => handleLabourSelect(labour._id)}
// //                             />
// //                           }
// //                           label={labour.name}
// //                         />
// //                       </Grid>
// //                     ))}
// //                   </Grid>
// //                 </Box>
// //               </Grid>
// //             </Grid>
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleCloseBulkDialog}>{t("common.cancel")}</Button>
// //             <LoadingButton
// //               loading={bulkAttendanceFormik.isSubmitting}
// //               type="submit"
// //               variant="contained"
// //               disabled={
// //                 !bulkAttendanceFormik.isValid || bulkAttendanceFormik.isSubmitting || selectedLabours.length === 0
// //               }
// //             >
// //               {t("common.save")}
// //             </LoadingButton>
// //           </DialogActions>
// //         </form>
// //       </Dialog>

// //       {/* Confirm Delete Dialog */}
// //       <ConfirmDialog
// //         open={openConfirmDialog}
// //         title={t("attendance.deleteAttendance")}
// //         message={t("attendance.deleteConfirm")}
// //         onConfirm={handleDeleteAttendance}
// //         onCancel={() => {
// //           setOpenConfirmDialog(false)
// //           setAttendanceToDelete(null)
// //         }}
// //         confirmText={t("common.delete")}
// //         confirmColor="error"
// //       />

// //       {/* Snackbar for notifications */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={6000}
// //         onClose={() => setSnackbar({ ...snackbar, open: false })}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
// //       >
// //         <Alert
// //           onClose={() => setSnackbar({ ...snackbar, open: false })}
// //           severity={snackbar.severity}
// //           sx={{ width: "100%" }}
// //         >
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   )
// // }

// // export default Attendance




// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useTranslation } from "react-i18next"
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   IconButton,
//   FormHelperText,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab,
//   Checkbox,
//   FormControlLabel,
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TablePagination,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material"
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Group as GroupIcon,
// } from "@mui/icons-material"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import { api } from "../../utils/api"
// import PageHeader from "../../components/common/PageHeader"
// import ConfirmDialog from "../../components/common/ConfirmDialog"
// import LoadingButton from "../../components/common/LoadingButton"

// const Attendance = () => {
//   const { t } = useTranslation()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const [attendances, setAttendances] = useState<any[]>([])
//   const [labours, setLabours] = useState<any[]>([])
//   const [projects, setProjects] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [openDialog, setOpenDialog] = useState(false)
//   const [openBulkDialog, setOpenBulkDialog] = useState(false)
//   const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
//   const [currentAttendance, setCurrentAttendance] = useState<any>(null)
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
//   const [attendanceToDelete, setAttendanceToDelete] = useState<string | null>(null)
//   const [tabValue, setTabValue] = useState(0)
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
//   const [selectedLabours, setSelectedLabours] = useState<string[]>([])
//   const [selectedProject, setSelectedProject] = useState<string>("")
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error",
//   })

//   const validationSchema = Yup.object({
//     date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
//     labour: Yup.string().required(t("attendance.labour") + " " + t("common.error")),
//     project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
//     isPresent: Yup.boolean().required(),
//     workHours: Yup.number().min(0).max(24).nullable(),
//     remarks: Yup.string(),
//   })

//   const formik = useFormik({
//     initialValues: {
//       date: new Date(),
//       labour: "",
//       project: "",
//       isPresent: true,
//       workHours: 8,
//       remarks: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const formData = {
//           ...values,
//           date: values.date.toISOString(),
//         }

//         if (dialogMode === "add") {
//           await api.post("/attendance", formData)
//           setSnackbar({
//             open: true,
//             message: t("attendance.addSuccess"),
//             severity: "success",
//           })
//         } else {
//           await api.put(`/attendance/${currentAttendance._id}`, formData)
//           setSnackbar({
//             open: true,
//             message: t("attendance.updateSuccess"),
//             severity: "success",
//           })
//         }

//         fetchAttendances()
//         handleCloseDialog()
//       } catch (error) {
//         console.error("Error saving attendance:", error)
//         setSnackbar({
//           open: true,
//           message: "Error saving attendance",
//           severity: "error",
//         })
//       }
//     },
//   })

//   const bulkAttendanceFormik = useFormik({
//     initialValues: {
//       date: new Date(),
//       project: "",
//       isPresent: true,
//       workHours: 8,
//       remarks: "",
//     },
//     validationSchema: Yup.object({
//       date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
//       project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
//       isPresent: Yup.boolean().required(),
//       workHours: Yup.number().min(0).max(24).nullable(),
//       remarks: Yup.string(),
//     }),
//     onSubmit: async (values) => {
//       try {
//         if (selectedLabours.length === 0) {
//           setSnackbar({
//             open: true,
//             message: "Please select at least one labour",
//             severity: "error",
//           })
//           return
//         }

//         const promises = selectedLabours.map((labourId) =>
//           api.post("/attendance", {
//             ...values,
//             labour: labourId,
//             date: values.date.toISOString(),
//           }),
//         )

//         await Promise.all(promises)

//         setSnackbar({
//           open: true,
//           message: t("attendance.addSuccess"),
//           severity: "success",
//         })

//         fetchAttendances()
//         handleCloseBulkDialog()
//       } catch (error) {
//         console.error("Error saving bulk attendance:", error)
//         setSnackbar({
//           open: true,
//           message: "Error saving bulk attendance",
//           severity: "error",
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     fetchAttendances()
//     fetchLabours()
//     fetchProjects()
//   }, [])

//   useEffect(() => {
//     if (selectedDate) {
//       fetchAttendances(selectedDate)
//     }
//   }, [selectedDate])

//   const fetchAttendances = async (date = new Date()) => {
//     try {
//       setLoading(true)
//       const formattedDate = date.toISOString().split("T")[0]
//       const response = await api.get(`/attendance?date[gte]=${formattedDate}&date[lte]=${formattedDate}T23:59:59.999Z`)
//       setAttendances(response.data.data)
//     } catch (error) {
//       console.error("Error fetching attendances:", error)
//       setSnackbar({
//         open: true,
//         message: "Error fetching attendances",
//         severity: "error",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchLabours = async () => {
//     try {
//       const response = await api.get("/labours")
//       setLabours(response.data.data)
//     } catch (error) {
//       console.error("Error fetching labours:", error)
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

//   const handleOpenDialog = (mode: "add" | "edit", attendance?: any) => {
//     setDialogMode(mode)
//     if (mode === "edit" && attendance) {
//       setCurrentAttendance(attendance)
//       formik.setValues({
//         date: new Date(attendance.date),
//         labour: attendance.labour._id,
//         project: attendance.project._id,
//         isPresent: attendance.isPresent,
//         workHours: attendance.workHours || 8,
//         remarks: attendance.remarks || "",
//       })
//     } else {
//       formik.resetForm()
//       formik.setValues({
//         ...formik.initialValues,
//         date: selectedDate || new Date(),
//       })
//       setCurrentAttendance(null)
//     }
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     formik.resetForm()
//   }

//   const handleOpenBulkDialog = () => {
//     setSelectedLabours([])
//     setSelectedProject("")
//     bulkAttendanceFormik.resetForm()
//     bulkAttendanceFormik.setValues({
//       ...bulkAttendanceFormik.initialValues,
//       date: selectedDate || new Date(),
//     })
//     setOpenBulkDialog(true)
//   }

//   const handleCloseBulkDialog = () => {
//     setOpenBulkDialog(false)
//     setSelectedLabours([])
//     setSelectedProject("")
//     bulkAttendanceFormik.resetForm()
//   }

//   const handleDeleteAttendance = async () => {
//     if (!attendanceToDelete) return

//     try {
//       await api.delete(`/attendance/${attendanceToDelete}`)
//       setSnackbar({
//         open: true,
//         message: t("attendance.deleteSuccess"),
//         severity: "success",
//       })
//       fetchAttendances(selectedDate || new Date())
//     } catch (error) {
//       console.error("Error deleting attendance:", error)
//       setSnackbar({
//         open: true,
//         message: "Error deleting attendance",
//         severity: "error",
//       })
//     } finally {
//       setOpenConfirmDialog(false)
//       setAttendanceToDelete(null)
//     }
//   }

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(Number.parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   const handleLabourSelect = (labourId: string) => {
//     setSelectedLabours((prev) => (prev.includes(labourId) ? prev.filter((id) => id !== labourId) : [...prev, labourId]))
//   }

//   const handleSelectAllLabours = () => {
//     if (selectedLabours.length === labours.length) {
//       setSelectedLabours([])
//     } else {
//       setSelectedLabours(labours.map((labour) => labour._id))
//     }
//   }

//   const filteredAttendances = attendances.filter((attendance) => {
//     if (tabValue === 1) return attendance.isPresent
//     if (tabValue === 2) return !attendance.isPresent
//     return true
//   })

//   const paginatedAttendances = filteredAttendances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

//   // Define a color palette for cards
//   const cardColors = [
//     { background: "linear-gradient(135deg, #6e8efb, #a777e3)", text: "#ffffff" },
//     { background: "linear-gradient(135deg, #42a5f5, #478ed1)", text: "#ffffff" },
//     { background: "linear-gradient(135deg, #66bb6a, #388e3c)", text: "#ffffff" },
//     { background: "linear-gradient(135deg, #ff7043, #f4511e)", text: "#ffffff" },
//   ]

//   return (
//     <Box>
//       <PageHeader
//         title={t("navigation.attendance")}
//         action={{
//           text: t("attendance.markAttendance"),
//           icon: <AddIcon />,
//           onClick: () => handleOpenDialog("add"),
//         }}
//       />

//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label={t("attendance.date")}
//               value={selectedDate}
//               onChange={(newValue) => setSelectedDate(newValue)}
//               slotProps={{ textField: { fullWidth: true, size: "small" } }}
//               sx={{ flexGrow: 1 }}
//             />
//           </LocalizationProvider>
//           <Button
//             variant="outlined"
//             startIcon={<GroupIcon />}
//             onClick={handleOpenBulkDialog}
//             sx={{ whiteSpace: "nowrap" }}
//           >
//             {t("attendance.bulkAttendance")}
//           </Button>
//         </Box>
//       </Paper>

//       <Paper sx={{ borderRadius: 2 }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           aria-label="attendance tabs"
//           sx={{ borderBottom: 1, borderColor: "divider" }}
//         >
//           <Tab label={t("common.all")} />
//           <Tab label={t("common.yes")} />
//           <Tab label={t("common.no")} />
//         </Tabs>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : filteredAttendances.length === 0 ? (
//           <Box sx={{ p: 4, textAlign: "center" }}>
//             <Typography variant="body1">{t("common.noData")}</Typography>
//           </Box>
//         ) : isMobile ? (
//           <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//             {paginatedAttendances.map((attendance, index) => {
//               const cardStyle = cardColors[index % cardColors.length]
//               return (
//                 <Paper
//                   key={attendance._id}
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     background: cardStyle.background,
//                     color: cardStyle.text,
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                     transition: "transform 0.2s",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                     },
//                   }}
//                 >
//                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       {attendance.labour.name}
//                     </Typography>
//                     <Box>
//                       <IconButton
//                         size="small"
//                         sx={{ color: cardStyle.text }}
//                         onClick={() => handleOpenDialog("edit", attendance)}
//                       >
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         sx={{ color: cardStyle.text }}
//                         onClick={() => {
//                           setAttendanceToDelete(attendance._id)
//                           setOpenConfirmDialog(true)
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                   <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
//                     {t("attendance.project")}: {attendance.project.name} ({attendance.project.type})
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//                     <Typography variant="body2">{t("attendance.isPresent")}:</Typography>
//                     {attendance.isPresent ? (
//                       <CheckCircleIcon sx={{ color: "#ffffff" }} fontSize="small" />
//                     ) : (
//                       <CancelIcon sx={{ color: "#ffffff" }} fontSize="small" />
//                     )}
//                   </Box>
//                   <Typography variant="body2" sx={{ mb: 1 }}>
//                     {t("attendance.workHours")}: {attendance.workHours || "-"}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mb: 1 }}>
//                     {t("attendance.wages")}: ₹{attendance.wages.toFixed(2)}
//                   </Typography>
//                   <Typography variant="body2">
//                     {t("attendance.remarks")}: {attendance.remarks || "-"}
//                   </Typography>
//                 </Paper>
//               )
//             })}
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={filteredAttendances.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               sx={{ mt: 2 }}
//             />
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>{t("attendance.labour")}</TableCell>
//                   <TableCell>{t("attendance.project")}</TableCell>
//                   <TableCell align="center">{t("attendance.isPresent")}</TableCell>
//                   <TableCell align="center">{t("attendance.workHours")}</TableCell>
//                   <TableCell align="right">{t("attendance.wages")}</TableCell>
//                   <TableCell>{t("attendance.remarks")}</TableCell>
//                   <TableCell align="center">{t("common.actions")}</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedAttendances.map((attendance) => (
//                   <TableRow key={attendance._id}>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="medium">
//                         {attendance.labour.name}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">{attendance.project.name}</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {attendance.project.type}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       {attendance.isPresent ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
//                     </TableCell>
//                     <TableCell align="center">{attendance.workHours || "-"}</TableCell>
//                     <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
//                     <TableCell>{attendance.remarks || "-"}</TableCell>
//                     <TableCell align="center">
//                       <IconButton size="small" color="primary" onClick={() => handleOpenDialog("edit", attendance)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={() => {
//                           setAttendanceToDelete(attendance._id)
//                           setOpenConfirmDialog(true)
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={filteredAttendances.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </TableContainer>
//         )}
//       </Paper>

//       {/* Add/Edit Attendance Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogTitle>
//             {dialogMode === "add" ? t("attendance.markAttendance") : t("attendance.editAttendance")}
//           </DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label={t("attendance.date")}
//                     value={formik.values.date}
//                     onChange={(newValue) => formik.setFieldValue("date", newValue)}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         error: formik.touched.date && Boolean(formik.errors.date),
//                         helperText: formik.touched.date && formik.errors.date,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={formik.touched.labour && Boolean(formik.errors.labour)}>
//                   <InputLabel id="labour-label">{t("attendance.labour")}</InputLabel>
//                   <Select
//                     labelId="labour-label"
//                     id="labour"
//                     name="labour"
//                     value={formik.values.labour}
//                     label={t("attendance.labour")}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   >
//                     {labours.map((labour) => (
//                       <MenuItem key={labour._id} value={labour._id}>
//                         {labour.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {formik.touched.labour && formik.errors.labour && (
//                     <FormHelperText>{formik.errors.labour}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={formik.touched.project && Boolean(formik.errors.project)}>
//                   <InputLabel id="project-label">{t("attendance.project")}</InputLabel>
//                   <Select
//                     labelId="project-label"
//                     id="project"
//                     name="project"
//                     value={formik.values.project}
//                     label={t("attendance.project")}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   >
//                     {projects.map((project) => (
//                       <MenuItem key={project._id} value={project._id}>
//                         {project.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {formik.touched.project && formik.errors.project && (
//                     <FormHelperText>{formik.errors.project}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel id="isPresent-label">{t("attendance.isPresent")}</InputLabel>
//                   <Select
//                     labelId="isPresent-label"
//                     id="isPresent"
//                     name="isPresent"
//                     value={formik.values.isPresent}
//                     label={t("attendance.isPresent")}
//                     onChange={formik.handleChange}
//                   >
//                     <MenuItem value={true}>{t("common.yes")}</MenuItem>
//                     <MenuItem value={false}>{t("common.no")}</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="workHours"
//                   name="workHours"
//                   label={t("attendance.workHours")}
//                   type="number"
//                   value={formik.values.workHours}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.workHours && Boolean(formik.errors.workHours)}
//                   helperText={formik.touched.workHours && formik.errors.workHours}
//                   disabled={!formik.values.isPresent}
//                   InputProps={{ inputProps: { min: 0, max: 24 } }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   id="remarks"
//                   name="remarks"
//                   label={t("attendance.remarks")}
//                   value={formik.values.remarks}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.remarks && Boolean(formik.errors.remarks)}
//                   helperText={formik.touched.remarks && formik.errors.remarks}
//                   multiline
//                   rows={2}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
//             <LoadingButton
//               loading={formik.isSubmitting}
//               type="submit"
//               variant="contained"
//               disabled={!formik.isValid || formik.isSubmitting}
//             >
//               {t("common.save")}
//             </LoadingButton>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Bulk Attendance Dialog */}
//       <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="md" fullWidth>
//         <form onSubmit={bulkAttendanceFormik.handleSubmit}>
//           <DialogTitle>{t("attendance.bulkAttendance")}</DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DatePicker
//                     label={t("attendance.date")}
//                     value={bulkAttendanceFormik.values.date}
//                     onChange={(newValue) => bulkAttendanceFormik.setFieldValue("date", newValue)}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         error: bulkAttendanceFormik.touched.date && Boolean(bulkAttendanceFormik.errors.date),
//                         helperText: bulkAttendanceFormik.touched.date && bulkAttendanceFormik.errors.date,
//                       },
//                     }}
//                   />
//                 </LocalizationProvider>
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControl
//                   fullWidth
//                   error={bulkAttendanceFormik.touched.project && Boolean(bulkAttendanceFormik.errors.project)}
//                 >
//                   <InputLabel id="bulk-project-label">{t("attendance.project")}</InputLabel>
//                   <Select
//                     labelId="bulk-project-label"
//                     id="project"
//                     name="project"
//                     value={bulkAttendanceFormik.values.project}
//                     label={t("attendance.project")}
//                     onChange={bulkAttendanceFormik.handleChange}
//                     onBlur={bulkAttendanceFormik.handleBlur}
//                   >
//                     {projects.map((project) => (
//                       <MenuItem key={project._id} value={project._id}>
//                         {project.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {bulkAttendanceFormik.touched.project && bulkAttendanceFormik.errors.project && (
//                     <FormHelperText>{bulkAttendanceFormik.errors.project}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel id="bulk-isPresent-label">{t("attendance.isPresent")}</InputLabel>
//                   <Select
//                     labelId="bulk-isPresent-label"
//                     id="isPresent"
//                     name="isPresent"
//                     value={bulkAttendanceFormik.values.isPresent}
//                     label={t("attendance.isPresent")}
//                     onChange={bulkAttendanceFormik.handleChange}
//                   >
//                     <MenuItem value={true}>{t("common.yes")}</MenuItem>
//                     <MenuItem value={false}>{t("common.no")}</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="workHours"
//                   name="workHours"
//                   label={t("attendance.workHours")}
//                   type="number"
//                   value={bulkAttendanceFormik.values.workHours}
//                   onChange={bulkAttendanceFormik.handleChange}
//                   onBlur={bulkAttendanceFormik.handleBlur}
//                   error={bulkAttendanceFormik.touched.workHours && Boolean(bulkAttendanceFormik.errors.workHours)}
//                   helperText={bulkAttendanceFormik.touched.workHours && bulkAttendanceFormik.errors.workHours}
//                   disabled={!bulkAttendanceFormik.values.isPresent}
//                   InputProps={{ inputProps: { min: 0, max: 24 } }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   id="remarks"
//                   name="remarks"
//                   label={t("attendance.remarks")}
//                   value={bulkAttendanceFormik.values.remarks}
//                   onChange={bulkAttendanceFormik.handleChange}
//                   onBlur={bulkAttendanceFormik.handleBlur}
//                   error={bulkAttendanceFormik.touched.remarks && Boolean(bulkAttendanceFormik.errors.remarks)}
//                   helperText={bulkAttendanceFormik.touched.remarks && bulkAttendanceFormik.errors.remarks}
//                   multiline
//                   rows={2}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   {t("attendance.selectLabours")}
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={selectedLabours.length === labours.length}
//                       indeterminate={selectedLabours.length > 0 && selectedLabours.length < labours.length}
//                       onChange={handleSelectAllLabours}
//                     />
//                   }
//                   label={t("common.all")}
//                 />
//                 <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1, border: 1, borderColor: "divider", p: 1 }}>
//                   <Grid container spacing={1}>
//                     {labours.map((labour) => (
//                       <Grid item xs={12} sm={6} key={labour._id}>
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={selectedLabours.includes(labour._id)}
//                               onChange={() => handleLabourSelect(labour._id)}
//                             />
//                           }
//                           label={labour.name}
//                         />
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseBulkDialog}>{t("common.cancel")}</Button>
//             <LoadingButton
//               loading={bulkAttendanceFormik.isSubmitting}
//               type="submit"
//               variant="contained"
//               disabled={
//                 !bulkAttendanceFormik.isValid || bulkAttendanceFormik.isSubmitting || selectedLabours.length === 0
//               }
//             >
//               {t("common.save")}
//             </LoadingButton>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Confirm Delete Dialog */}
//       <ConfirmDialog
//         open={openConfirmDialog}
//         title={t("attendance.deleteAttendance")}
//         message={t("attendance.deleteConfirm")}
//         onConfirm={handleDeleteAttendance}
//         onCancel={() => {
//           setOpenConfirmDialog(false)
//           setAttendanceToDelete(null)
//         }}
//         confirmText={t("common.delete")}
//         confirmColor="error"
//       />

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// export default Attendance




"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Group as GroupIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import LoadingButton from "../../components/common/LoadingButton"

const Attendance = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [attendances, setAttendances] = useState<any[]>([])
  const [labours, setLabours] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openBulkDialog, setOpenBulkDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentAttendance, setCurrentAttendance] = useState<any>(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [attendanceToDelete, setAttendanceToDelete] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedLabours, setSelectedLabours] = useState<string[]>([])
  const [, setSelectedProject] = useState<string>("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const validationSchema = Yup.object({
    date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
    labour: Yup.string().required(t("attendance.labour") + " " + t("common.error")),
    project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
    isPresent: Yup.boolean().required(),
    workHours: Yup.number().min(0).max(24).nullable(),
    remarks: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      labour: "",
      project: "",
      isPresent: true,
      workHours: 8,
      remarks: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          date: values.date.toISOString(),
        }

        if (dialogMode === "add") {
          await api.post("/attendance", formData)
          setSnackbar({
            open: true,
            message: t("attendance.addSuccess"),
            severity: "success",
          })
        } else {
          await api.put(`/attendance/${currentAttendance._id}`, formData)
          setSnackbar({
            open: true,
            message: t("attendance.updateSuccess"),
            severity: "success",
          })
        }

        fetchAttendances()
        handleCloseDialog()
      } catch (error) {
        console.error("Error saving attendance:", error)
        setSnackbar({
          open: true,
          message: "Error saving attendance",
          severity: "error",
        })
      }
    },
  })

  const bulkAttendanceFormik = useFormik({
    initialValues: {
      date: new Date(),
      project: "",
      isPresent: true,
      workHours: 8,
      remarks: "",
    },
    validationSchema: Yup.object({
      date: Yup.date().required(t("attendance.date") + " " + t("common.error")),
      project: Yup.string().required(t("attendance.project") + " " + t("common.error")),
      isPresent: Yup.boolean().required(),
      workHours: Yup.number().min(0).max(24).nullable(),
      remarks: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedLabours.length === 0) {
          setSnackbar({
            open: true,
            message: "Please select at least one labour",
            severity: "error",
          })
          return
        }

        const promises = selectedLabours.map((labourId) =>
          api.post("/attendance", {
            ...values,
            labour: labourId,
            date: values.date.toISOString(),
          }),
        )

        await Promise.all(promises)

        setSnackbar({
          open: true,
          message: t("attendance.addSuccess"),
          severity: "success",
        })

        fetchAttendances()
        handleCloseBulkDialog()
      } catch (error) {
        console.error("Error saving bulk attendance:", error)
        setSnackbar({
          open: true,
          message: "Error saving bulk attendance",
          severity: "error",
        })
      }
    },
  })

  useEffect(() => {
    fetchAttendances()
    fetchLabours()
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAttendances(selectedDate)
    }
  }, [selectedDate])

  const fetchAttendances = async (date = new Date()) => {
    try {
      setLoading(true)
      const formattedDate = date.toISOString().split("T")[0]
      const response = await api.get(`/attendance?date[gte]=${formattedDate}&date[lte]=${formattedDate}T23:59:59.999Z`)
      setAttendances(response.data.data)
    } catch (error) {
      console.error("Error fetching attendances:", error)
      setSnackbar({
        open: true,
        message: "Error fetching attendances",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLabours = async () => {
    try {
      const response = await api.get("/labours")
      setLabours(response.data.data)
    } catch (error) {
      console.error("Error fetching labours:", error)
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

  const handleOpenDialog = (mode: "add" | "edit", attendance?: any) => {
    setDialogMode(mode)
    if (mode === "edit" && attendance) {
      setCurrentAttendance(attendance)
      formik.setValues({
        date: new Date(attendance.date),
        labour: attendance.labour._id,
        project: attendance.project._id,
        isPresent: attendance.isPresent,
        workHours: attendance.workHours || 8,
        remarks: attendance.remarks || "",
      })
    } else {
      formik.resetForm()
      formik.setValues({
        ...formik.initialValues,
        date: selectedDate || new Date(),
      })
      setCurrentAttendance(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    formik.resetForm()
  }

  const handleOpenBulkDialog = () => {
    setSelectedLabours([])
    setSelectedProject("")
    bulkAttendanceFormik.resetForm()
    bulkAttendanceFormik.setValues({
      ...bulkAttendanceFormik.initialValues,
      date: selectedDate || new Date(),
    })
    setOpenBulkDialog(true)
  }

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false)
    setSelectedLabours([])
    setSelectedProject("")
    bulkAttendanceFormik.resetForm()
  }

  const handleDeleteAttendance = async () => {
    if (!attendanceToDelete) return

    try {
      await api.delete(`/attendance/${attendanceToDelete}`)
      setSnackbar({
        open: true,
        message: t("attendance.deleteSuccess"),
        severity: "success",
      })
      fetchAttendances(selectedDate || new Date())
    } catch (error) {
      console.error("Error deleting attendance:", error)
      setSnackbar({
        open: true,
        message: "Error deleting attendance",
        severity: "error",
      })
    } finally {
      setOpenConfirmDialog(false)
      setAttendanceToDelete(null)
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleLabourSelect = (labourId: string) => {
    setSelectedLabours((prev) => (prev.includes(labourId) ? prev.filter((id) => id !== labourId) : [...prev, labourId]))
  }

  const handleSelectAllLabours = () => {
    if (selectedLabours.length === labours.length) {
      setSelectedLabours([])
    } else {
      setSelectedLabours(labours.map((labour) => labour._id))
    }
  }

  const filteredAttendances = attendances.filter((attendance) => {
    if (tabValue === 1) return attendance.isPresent
    if (tabValue === 2) return !attendance.isPresent
    return true
  })

  const paginatedAttendances = filteredAttendances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const presentCount = filteredAttendances.filter((attendance) => attendance.isPresent).length

  // Define a trending color palette for cards
  const cardColors = [
    { 
      background: "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)", 
      text: "#ffffff",
      glassOverlay: "rgba(255, 255, 255, 0.1)"
    },
    { 
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
      text: "#ffffff",
      glassOverlay: "rgba(255, 255, 255, 0.1)"
    },
    { 
      background: "linear-gradient(135deg, #a445b2 0%, #d41872 100%)", 
      text: "#ffffff",
      glassOverlay: "rgba(255, 255, 255, 0.1)"
    },
    { 
      background: "linear-gradient(135deg, #40c9ff 0%, #e81cff 100%)", 
      text: "#ffffff",
      glassOverlay: "rgba(255, 255, 255, 0.1)"
    },
  ]

  return (
    <Box>
      <PageHeader
        title={t("navigation.attendance")}
        action={{
          text: t("attendance.markAttendance"),
          icon: <AddIcon />,
          onClick: () => handleOpenDialog("add"),
        }}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("attendance.date")}
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
              sx={{ flexGrow: 1 }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            onClick={handleOpenBulkDialog}
            sx={{ whiteSpace: "nowrap" }}
          >
            {t("attendance.bulkAttendance")}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 2, mb: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {t("attendance.totalPresent")}: {presentCount} / {filteredAttendances.length}
          </Typography>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="attendance tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={t("common.all")} />
          <Tab label={t("common.yes")} />
          <Tab label={t("common.no")} />
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredAttendances.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1">{t("common.noData")}</Typography>
          </Box>
        ) : isMobile ? (
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {paginatedAttendances.map((attendance, index) => {
              const cardStyle = cardColors[index % cardColors.length]
              return (
                <Paper
                  key={attendance._id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: cardStyle.background,
                    color: cardStyle.text,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "12px 12px 24px rgba(0,0,0,0.2), -12px -12px 24px rgba(255,255,255,0.15)",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: cardStyle.glassOverlay,
                      backdropFilter: "blur(8px)",
                      zIndex: 1,
                    },
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
                        {attendance.labour.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{ 
                            color: cardStyle.text, 
                            bgcolor: "rgba(255,255,255,0.2)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                            transition: "background-color 0.2s"
                          }}
                          onClick={() => handleOpenDialog("edit", attendance)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ 
                            color: cardStyle.text, 
                            bgcolor: "rgba(255,255,255,0.2)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                            transition: "background-color 0.2s"
                          }}
                          onClick={() => {
                            setAttendanceToDelete(attendance._id)
                            setOpenConfirmDialog(true)
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: "0.9rem" }}>
                      {t("attendance.project")}: {attendance.project.name} ({attendance.project.type})
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {t("attendance.isPresent")}:
                      </Typography>
                      {attendance.isPresent ? (
                        <CheckCircleIcon 
                          sx={{ color: "#ffffff", transform: "scale(1)", transition: "transform 0.2s" }} 
                          fontSize="small" 
                          className="hover:scale-110"
                        />
                      ) : (
                        <CancelIcon 
                          sx={{ color: "#ffffff", transform: "scale(1)", transition: "transform 0.2s" }} 
                          fontSize="small" 
                          className="hover:scale-110"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: "0.9rem" }}>
                      {t("attendance.workHours")}: {attendance.workHours || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: "0.9rem" }}>
                      {t("attendance.wages")}: ₹{attendance.wages.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {t("attendance.remarks")}: {attendance.remarks || "-"}
                    </Typography>
                  </Box>
                </Paper>
              )
            })}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAttendances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2 }}
            />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("attendance.labour")}</TableCell>
                  <TableCell>{t("attendance.project")}</TableCell>
                  <TableCell align="center">{t("attendance.isPresent")}</TableCell>
                  <TableCell align="center">{t("attendance.workHours")}</TableCell>
                  <TableCell align="right">{t("attendance.wages")}</TableCell>
                  <TableCell>{t("attendance.remarks")}</TableCell>
                  <TableCell align="center">{t("common.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAttendances.map((attendance) => (
                  <TableRow key={attendance._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {attendance.labour.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{attendance.project.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {attendance.project.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {attendance.isPresent ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </TableCell>
                    <TableCell align="center">{attendance.workHours || "-"}</TableCell>
                    <TableCell align="right">₹{attendance.wages.toFixed(2)}</TableCell>
                    <TableCell>{attendance.remarks || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog("edit", attendance)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setAttendanceToDelete(attendance._id)
                          setOpenConfirmDialog(true)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAttendances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {dialogMode === "add" ? t("attendance.markAttendance") : t("attendance.editAttendance")}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("attendance.date")}
                    value={formik.values.date}
                    onChange={(newValue) => formik.setFieldValue("date", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.date && Boolean(formik.errors.date),
                        helperText:
                        formik.touched.date && typeof formik.errors.date === "string"
                          ? formik.errors.date
                          : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.labour && Boolean(formik.errors.labour)}>
                  <InputLabel id="labour-label">{t("attendance.labour")}</InputLabel>
                  <Select
                    labelId="labour-label"
                    id="labour"
                    name="labour"
                    value={formik.values.labour}
                    label={t("attendance.labour")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {labours.map((labour) => (
                      <MenuItem key={labour._id} value={labour._id}>
                        {labour.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.labour && formik.errors.labour && (
                    <FormHelperText>{formik.errors.labour}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.project && Boolean(formik.errors.project)}>
                  <InputLabel id="project-label">{t("attendance.project")}</InputLabel>
                  <Select
                    labelId="project-label"
                    id="project"
                    name="project"
                    value={formik.values.project}
                    label={t("attendance.project")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.project && formik.errors.project && (
                    <FormHelperText>{formik.errors.project}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="isPresent-label">{t("attendance.isPresent")}</InputLabel>
                  <Select
                    labelId="isPresent-label"
                    id="isPresent"
                    name="isPresent"
                    value={formik.values.isPresent}
                    label={t("attendance.isPresent")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="true">{t("common.yes")}</MenuItem>
                    <MenuItem value="false">{t("common.no")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="workHours"
                  name="workHours"
                  label={t("attendance.workHours")}
                  type="number"
                  value={formik.values.workHours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.workHours && Boolean(formik.errors.workHours)}
                  helperText={formik.touched.workHours && formik.errors.workHours}
                  disabled={!formik.values.isPresent}
                  InputProps={{ inputProps: { min: 0, max: 24 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="remarks"
                  name="remarks"
                  label={t("attendance.remarks")}
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                  helperText={formik.touched.remarks && formik.errors.remarks}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
            <LoadingButton
              loading={formik.isSubmitting}
              type="submit"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t("common.save")}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bulk Attendance Dialog */}
      <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="md" fullWidth>
        <form onSubmit={bulkAttendanceFormik.handleSubmit}>
          <DialogTitle>{t("attendance.bulkAttendance")}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("attendance.date")}
                    value={bulkAttendanceFormik.values.date}
                    onChange={(newValue) => bulkAttendanceFormik.setFieldValue("date", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: bulkAttendanceFormik.touched.date && Boolean(bulkAttendanceFormik.errors.date),
                        helperText:
            bulkAttendanceFormik.touched.date && typeof bulkAttendanceFormik.errors.date === "string"
              ? bulkAttendanceFormik.errors.date
              : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={bulkAttendanceFormik.touched.project && Boolean(bulkAttendanceFormik.errors.project)}
                >
                  <InputLabel id="bulk-project-label">{t("attendance.project")}</InputLabel>
                  <Select
                    labelId="bulk-project-label"
                    id="project"
                    name="project"
                    value={bulkAttendanceFormik.values.project}
                    label={t("attendance.project")}
                    onChange={bulkAttendanceFormik.handleChange}
                    onBlur={bulkAttendanceFormik.handleBlur}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {bulkAttendanceFormik.touched.project && bulkAttendanceFormik.errors.project && (
                    <FormHelperText>{bulkAttendanceFormik.errors.project}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="bulk-isPresent-label">{t("attendance.isPresent")}</InputLabel>
                  <Select
                    labelId="bulk-isPresent-label"
                    id="isPresent"
                    name="isPresent"
                    value={bulkAttendanceFormik.values.isPresent}
                    label={t("attendance.isPresent")}
                    onChange={bulkAttendanceFormik.handleChange}
                  >
                    <MenuItem value="true">{t("common.yes")}</MenuItem>
                    <MenuItem value="false">{t("common.no")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="workHours"
                  name="workHours"
                  label={t("attendance.workHours")}
                  type="number"
                  value={bulkAttendanceFormik.values.workHours}
                  onChange={bulkAttendanceFormik.handleChange}
                  onBlur={bulkAttendanceFormik.handleBlur}
                  error={bulkAttendanceFormik.touched.workHours && Boolean(bulkAttendanceFormik.errors.workHours)}
                  helperText={bulkAttendanceFormik.touched.workHours && bulkAttendanceFormik.errors.workHours}
                  disabled={!bulkAttendanceFormik.values.isPresent}
                  InputProps={{ inputProps: { min: 0, max: 24 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="remarks"
                  name="remarks"
                  label={t("attendance.remarks")}
                  value={bulkAttendanceFormik.values.remarks}
                  onChange={bulkAttendanceFormik.handleChange}
                  onBlur={bulkAttendanceFormik.handleBlur}
                  error={bulkAttendanceFormik.touched.remarks && Boolean(bulkAttendanceFormik.errors.remarks)}
                  helperText={bulkAttendanceFormik.touched.remarks && bulkAttendanceFormik.errors.remarks}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {t("attendance.selectLabours")}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedLabours.length === labours.length}
                      indeterminate={selectedLabours.length > 0 && selectedLabours.length < labours.length}
                      onChange={handleSelectAllLabours}
                    />
                  }
                  label={t("common.all")}
                />
                <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1, border: 1, borderColor: "divider", p: 1 }}>
                  <Grid container spacing={1}>
                    {labours.map((labour) => (
                      <Grid item xs={12} sm={6} key={labour._id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedLabours.includes(labour._id)}
                              onChange={() => handleLabourSelect(labour._id)}
                            />
                          }
                          label={labour.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBulkDialog}>{t("common.cancel")}</Button>
            <LoadingButton
              loading={bulkAttendanceFormik.isSubmitting}
              type="submit"
              variant="contained"
              disabled={
                !bulkAttendanceFormik.isValid || bulkAttendanceFormik.isSubmitting || selectedLabours.length === 0
              }
            >
              {t("common.save")}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title={t("attendance.deleteAttendance")}
        message={t("attendance.deleteConfirm")}
        onConfirm={handleDeleteAttendance}
        onCancel={() => {
          setOpenConfirmDialog(false)
          setAttendanceToDelete(null)
        }}
        confirmText={t("common.delete")}
        confirmColor="error"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Attendance
