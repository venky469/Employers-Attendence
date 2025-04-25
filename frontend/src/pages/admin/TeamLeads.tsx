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
//   Card,
//   CardContent,
//   CardActions,
//   Avatar,
//   Chip,
//   FormHelperText,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   InputAdornment,
//   Tabs,
//   Tab,
//   Divider,
// } from "@mui/material"
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   CheckCircle as CheckCircleIcon,
//   CloudUpload as CloudUploadIcon,
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon,
// } from "@mui/icons-material"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import { api } from "../../utils/api"
// import PageHeader from "../../components/common/PageHeader"
// import ConfirmDialog from "../../components/common/ConfirmDialog"
// import LoadingButton from "../../components/common/LoadingButton"

// const TeamLeads = () => {
//   const { t } = useTranslation()
//   const [teamLeads, setTeamLeads] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [openDialog, setOpenDialog] = useState(false)
//   const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
//   const [currentTeamLead, setCurrentTeamLead] = useState<any>(null)
//   const [profileImage, setProfileImage] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
//   const [teamLeadToDelete, setTeamLeadToDelete] = useState<string | null>(null)
//   const [openApproveDialog, setOpenApproveDialog] = useState(false)
//   const [teamLeadToApprove, setTeamLeadToApprove] = useState<string | null>(null)
//   const [tabValue, setTabValue] = useState(0)
//   const [showPassword, setShowPassword] = useState(false)
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error",
//   })

  

//   const validationSchema = Yup.object({
//     name: Yup.string().required(t("auth.name") + " " + t("common.error")),
//     mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
//     email: Yup.string().email(t("auth.email") + " " + t("common.error")),
//     password: Yup.string().min(6, t("auth.password") + " " + t("common.error")),
//     address: Yup.string(),
//     village: Yup.string(),
//     preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
//   })

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       mobileNumber: "",
//       email: "",
//       password: "",
//       address: "",
//       village: "",
//       preferredLanguage: "telugu",
//       isApproved: false,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const formData = {
//           ...values,
//           role: "teamLead",
//           profileImageBase64: profileImage,
//         }

//         if (dialogMode === "add") {
//           await api.post("/users", formData)
//           setSnackbar({
//             open: true,
//             message: "Team Lead added successfully",
//             severity: "success",
//           })
//         } else {
//           // Don't send password if it's empty (not being updated)
//           if (!formData.password) {
//             delete formData.password
//           }
//           await api.put(`/users/${currentTeamLead._id}`, formData)
//           setSnackbar({
//             open: true,
//             message: "Team Lead updated successfully",
//             severity: "success",
//           })
//         }

//         fetchTeamLeads()
//         handleCloseDialog()
//       } catch (error) {
//         console.error("Error saving team lead:", error)
//         setSnackbar({
//           open: true,
//           message: "Error saving team lead",
//           severity: "error",
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     fetchTeamLeads()
//   }, [])

//   const fetchTeamLeads = async () => {
//     try {
//       setLoading(true)
//       const response = await api.get("/users")
//       setTeamLeads(response.data.data)
//     } catch (error) {
//       console.error("Error fetching team leads:", error)
//       setSnackbar({
//         open: true,
//         message: "Error fetching team leads",
//         severity: "error",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleOpenDialog = (mode: "add" | "edit", teamLead?: any) => {
//     setDialogMode(mode)
//     if (mode === "edit" && teamLead) {
//       setCurrentTeamLead(teamLead)
//       formik.setValues({
//         name: teamLead.name || "",
//         mobileNumber: teamLead.mobileNumber || "",
//         email: teamLead.email || "",
//         password: "", // Don't show the password
//         address: teamLead.address || "",
//         village: teamLead.village || "",
//         preferredLanguage: teamLead.preferredLanguage || "telugu",
//         isApproved: teamLead.isApproved || false,
//       })
//       setProfileImage(teamLead.profileImage || null)
//     } else {
//       formik.resetForm()
//       setProfileImage(null)
//       setCurrentTeamLead(null)
//     }
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     formik.resetForm()
//     setProfileImage(null)
//   }

//   const handleDeleteTeamLead = async () => {
//     if (!teamLeadToDelete) return

//     try {
//       await api.delete(`/users/${teamLeadToDelete}`)
//       setSnackbar({
//         open: true,
//         message: "Team Lead deleted successfully",
//         severity: "success",
//       })
//       fetchTeamLeads()
//     } catch (error) {
//       console.error("Error deleting team lead:", error)
//       setSnackbar({
//         open: true,
//         message: "Error deleting team lead",
//         severity: "error",
//       })
//     } finally {
//       setOpenConfirmDialog(false)
//       setTeamLeadToDelete(null)
//     }
//   }

//   const handleApproveTeamLead = async () => {
//     if (!teamLeadToApprove) return

//     try {
//       await api.put(`/users/${teamLeadToApprove}/approve`)
//       setSnackbar({
//         open: true,
//         message: "Team Lead approved successfully",
//         severity: "success",
//       })
//       fetchTeamLeads()
//     } catch (error) {
//       console.error("Error approving team lead:", error)
//       setSnackbar({
//         open: true,
//         message: "Error approving team lead",
//         severity: "error",
//       })
//     } finally {
//       setOpenApproveDialog(false)
//       setTeamLeadToApprove(null)
//     }
//   }

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   const filteredTeamLeads = teamLeads.filter(
//     (teamLead) =>
//       teamLead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (teamLead.mobileNumber && teamLead.mobileNumber.includes(searchTerm)) ||
//       (teamLead.email && teamLead.email.toLowerCase().includes(searchTerm.toLowerCase())),
//   )

//   const displayTeamLeads = filteredTeamLeads.filter((teamLead) => {
//     if (tabValue === 0) return true // All
//     if (tabValue === 1) return teamLead.isApproved // Approved
//     if (tabValue === 2) return !teamLead.isApproved // Pending
//     return true
//   })

//   return (
//     <Box>
//       <PageHeader
//         title={t("navigation.teamLeads")}
//         action={{
//           text: "Add Team Lead",
//           icon: <AddIcon />,
//           onClick: () => handleOpenDialog("add"),
//         }}
//       />

//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               placeholder={t("common.search")}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Tabs value={tabValue} onChange={handleTabChange} aria-label="team lead tabs">
//               <Tab label={t("common.all")} />
//               <Tab label="Approved" />
//               <Tab label="Pending" />
//             </Tabs>
//           </Grid>
//         </Grid>
//       </Paper>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : displayTeamLeads.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
//           <Typography variant="body1">{t("common.noData")}</Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={3}>
//           {displayTeamLeads.map((teamLead) => (
//             <Grid item xs={12} sm={6} md={4} key={teamLead._id}>
//               <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Avatar
//                       src={teamLead.profileImage}
//                       alt={teamLead.name}
//                       sx={{ width: 56, height: 56, mr: 2, bgcolor: "primary.main" }}
//                     >
//                       {teamLead.name.charAt(0)}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6" component="div">
//                         {teamLead.name}
//                       </Typography>
//                       {teamLead.mobileNumber && (
//                         <Typography variant="body2" color="text.secondary">
//                           {teamLead.mobileNumber}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>

//                   <Divider sx={{ my: 1 }} />

//                   <Box sx={{ mt: 2 }}>
//                     {teamLead.email && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>Email:</strong> {teamLead.email}
//                       </Typography>
//                     )}
//                     {teamLead.address && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>{t("labour.address")}:</strong> {teamLead.address}
//                       </Typography>
//                     )}
//                     {teamLead.village && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>{t("auth.village")}:</strong> {teamLead.village}
//                       </Typography>
//                     )}
//                     <Box sx={{ display: "flex", mt: 2 }}>
//                       <Chip
//                         label={t(`labour.${teamLead.preferredLanguage}`)}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                         sx={{ mr: 1 }}
//                       />
//                       <Chip
//                         label={teamLead.isApproved ? "Approved" : "Pending"}
//                         size="small"
//                         color={teamLead.isApproved ? "success" : "warning"}
//                         variant="outlined"
//                       />
//                     </Box>
//                   </Box>
//                 </CardContent>
//                 <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
//                   <Box>
//                     <IconButton color="primary" onClick={() => handleOpenDialog("edit", teamLead)} size="small">
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => {
//                         setTeamLeadToDelete(teamLead._id)
//                         setOpenConfirmDialog(true)
//                       }}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Box>
//                   {!teamLead.isApproved && (
//                     <Button
//                       size="small"
//                       startIcon={<CheckCircleIcon />}
//                       variant="outlined"
//                       color="success"
//                       onClick={() => {
//                         setTeamLeadToApprove(teamLead._id)
//                         setOpenApproveDialog(true)
//                       }}
//                     >
//                       Approve
//                     </Button>
//                   )}
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Add/Edit Team Lead Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogTitle>{dialogMode === "add" ? "Add Team Lead" : "Edit Team Lead"}</DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   id="name"
//                   name="name"
//                   label={t("auth.name")}
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.name && Boolean(formik.errors.name)}
//                   helperText={formik.touched.name && formik.errors.name}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="mobileNumber"
//                   name="mobileNumber"
//                   label={t("auth.mobileNumber")}
//                   value={formik.values.mobileNumber}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
//                   helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
//                   disabled={dialogMode === "edit"}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="email"
//                   name="email"
//                   label={t("auth.email")}
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.email && Boolean(formik.errors.email)}
//                   helperText={formik.touched.email && formik.errors.email}
//                 />
//               </Grid>
//               {dialogMode === "add" && (
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     id="password"
//                     name="password"
//                     label={t("auth.password")}
//                     type={showPassword ? "text" : "password"}
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.password && Boolean(formik.errors.password)}
//                     helperText={formik.touched.password && formik.errors.password}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             aria-label="toggle password visibility"
//                             onClick={() => setShowPassword(!showPassword)}
//                             edge="end"
//                           >
//                             {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>
//               )}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="address"
//                   name="address"
//                   label={t("auth.address")}
//                   value={formik.values.address}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.address && Boolean(formik.errors.address)}
//                   helperText={formik.touched.address && formik.errors.address}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="village"
//                   name="village"
//                   label={t("auth.village")}
//                   value={formik.values.village}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.village && Boolean(formik.errors.village)}
//                   helperText={formik.touched.village && formik.errors.village}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl
//                   fullWidth
//                   error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}
//                 >
//                   <InputLabel id="preferredLanguage-label">{t("labour.preferredLanguage")}</InputLabel>
//                   <Select
//                     labelId="preferredLanguage-label"
//                     id="preferredLanguage"
//                     name="preferredLanguage"
//                     value={formik.values.preferredLanguage}
//                     label={t("labour.preferredLanguage")}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   >
//                     <MenuItem value="telugu">{t("labour.telugu")}</MenuItem>
//                     <MenuItem value="english">{t("labour.english")}</MenuItem>
//                   </Select>
//                   {formik.touched.preferredLanguage && formik.errors.preferredLanguage && (
//                     <FormHelperText>{formik.errors.preferredLanguage}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel id="isApproved-label">Approval Status</InputLabel>
//                   <Select
//                     labelId="isApproved-label"
//                     id="isApproved"
//                     name="isApproved"
//                     value={formik.values.isApproved}
//                     label="Approval Status"
//                     onChange={formik.handleChange}
//                   >
//                     <MenuItem value="true">Approved</MenuItem>
//                     <MenuItem value="false">Pending</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }} fullWidth>
//                   {profileImage ? t("labour.uploadImage") + " ✓" : t("labour.uploadImage")}
//                   <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                 </Button>
//                 {profileImage && (
//                   <Box sx={{ mt: 2, textAlign: "center" }}>
//                     <img
//                       src={profileImage || "/placeholder.svg"}
//                       alt="Profile Preview"
//                       style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "4px" }}
//                     />
//                   </Box>
//                 )}
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

//       {/* Confirm Delete Dialog */}
//       <ConfirmDialog
//         open={openConfirmDialog}
//         title="Delete Team Lead"
//         message="Are you sure you want to delete this team lead? This action cannot be undone."
//         onConfirm={handleDeleteTeamLead}
//         onCancel={() => {
//           setOpenConfirmDialog(false)
//           setTeamLeadToDelete(null)
//         }}
//         confirmText={t("common.delete")}
//         confirmColor="error"
//       />

//       {/* Confirm Approve Dialog */}
//       <ConfirmDialog
//         open={openApproveDialog}
//         title="Approve Team Lead"
//         message="Are you sure you want to approve this team lead?"
//         onConfirm={handleApproveTeamLead}
//         onCancel={() => {
//           setOpenApproveDialog(false)
//           setTeamLeadToApprove(null)
//         }}
//         confirmText="Approve"
//         confirmColor="success"
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

// export default TeamLeads





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
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import LoadingButton from "../../components/common/LoadingButton"

// Define interface for formik values
interface TeamLeadFormValues {
  name: string;
  mobileNumber: string;
  email: string;
  password?: string; // Mark password as optional
  address: string;
  village: string;
  preferredLanguage: string;
  isApproved: boolean;
}

const TeamLeads = () => {
  const { t } = useTranslation()
  const [teamLeads, setTeamLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentTeamLead, setCurrentTeamLead] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [teamLeadToDelete, setTeamLeadToDelete] = useState<string | null>(null)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [teamLeadToApprove, setTeamLeadToApprove] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const validationSchema = Yup.object({
    name: Yup.string().required(t("auth.name") + " " + t("common.error")),
    mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
    email: Yup.string().email(t("auth.email") + " " + t("common.error")),
    password: Yup.string().min(6, t("auth.password") + " " + t("common.error")),
    address: Yup.string(),
    village: Yup.string(),
    preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
  })

  const formik = useFormik<TeamLeadFormValues>({
    initialValues: {
      name: "",
      mobileNumber: "",
      email: "",
      password: "", // Still provided as empty string by default
      address: "",
      village: "",
      preferredLanguage: "telugu",
      isApproved: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          role: "teamLead",
          profileImageBase64: profileImage,
        }

        if (dialogMode === "add") {
          await api.post("/users", formData)
          setSnackbar({
            open: true,
            message: "Team Lead added successfully",
            severity: "success",
          })
        } else {
          // Don't send password if it's empty (not being updated)
          if (!formData.password) {
            delete formData.password
          }
          await api.put(`/users/${currentTeamLead._id}`, formData)
          setSnackbar({
            open: true,
            message: "Team Lead updated successfully",
            severity: "success",
          })
        }

        fetchTeamLeads()
        handleCloseDialog()
      } catch (error) {
        console.error("Error saving team lead:", error)
        setSnackbar({
          open: true,
          message: "Error saving team lead",
          severity: "error",
        })
      }
    },
  })

  useEffect(() => {
    fetchTeamLeads()
  }, [])

  const fetchTeamLeads = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users")
      setTeamLeads(response.data.data)
    } catch (error) {
      console.error("Error fetching team leads:", error)
      setSnackbar({
        open: true,
        message: "Error fetching team leads",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (mode: "add" | "edit", teamLead?: any) => {
    setDialogMode(mode)
    if (mode === "edit" && teamLead) {
      setCurrentTeamLead(teamLead)
      formik.setValues({
        name: teamLead.name || "",
        mobileNumber: teamLead.mobileNumber || "",
        email: teamLead.email || "",
        password: "", // Don't show the password
        address: teamLead.address || "",
        village: teamLead.village || "",
        preferredLanguage: teamLead.preferredLanguage || "telugu",
        isApproved: teamLead.isApproved || false,
      })
      setProfileImage(teamLead.profileImage || null)
    } else {
      formik.resetForm()
      setProfileImage(null)
      setCurrentTeamLead(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    formik.resetForm()
    setProfileImage(null)
  }

  const handleDeleteTeamLead = async () => {
    if (!teamLeadToDelete) return

    try {
      await api.delete(`/users/${teamLeadToDelete}`)
      setSnackbar({
        open: true,
        message: "Team Lead deleted successfully",
        severity: "success",
      })
      fetchTeamLeads()
    } catch (error) {
      console.error("Error deleting team lead:", error)
      setSnackbar({
        open: true,
        message: "Error deleting team lead",
        severity: "error",
      })
    } finally {
      setOpenConfirmDialog(false)
      setTeamLeadToDelete(null)
    }
  }

  const handleApproveTeamLead = async () => {
    if (!teamLeadToApprove) return

    try {
      await api.put(`/users/${teamLeadToApprove}/approve`)
      setSnackbar({
        open: true,
        message: "Team Lead approved successfully",
        severity: "success",
      })
      fetchTeamLeads()
    } catch (error) {
      console.error("Error approving team lead:", error)
      setSnackbar({
        open: true,
        message: "Error approving team lead",
        severity: "error",
      })
    } finally {
      setOpenApproveDialog(false)
      setTeamLeadToApprove(null)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const filteredTeamLeads = teamLeads.filter(
    (teamLead) =>
      teamLead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teamLead.mobileNumber && teamLead.mobileNumber.includes(searchTerm)) ||
      (teamLead.email && teamLead.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const displayTeamLeads = filteredTeamLeads.filter((teamLead) => {
    if (tabValue === 0) return true // All
    if (tabValue === 1) return teamLead.isApproved // Approved
    if (tabValue === 2) return !teamLead.isApproved // Pending
    return true
  })

  return (
    <Box>
      <PageHeader
        title={t("navigation.teamLeads")}
        action={{
          text: "Add Team Lead",
          icon: <AddIcon />,
          onClick: () => handleOpenDialog("add"),
        }}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="team lead tabs">
              <Tab label={t("common.all")} />
              <Tab label="Approved" />
              <Tab label="Pending" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayTeamLeads.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="body1">{t("common.noData")}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {displayTeamLeads.map((teamLead) => (
            <Grid item xs={12} sm={6} md={4} key={teamLead._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={teamLead.profileImage}
                      alt={teamLead.name}
                      sx={{ width: 56, height: 56, mr: 2, bgcolor: "primary.main" }}
                    >
                      {teamLead.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {teamLead.name}
                      </Typography>
                      {teamLead.mobileNumber && (
                        <Typography variant="body2" color="text.secondary">
                          {teamLead.mobileNumber}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ mt: 2 }}>
                    {teamLead.email && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {teamLead.email}
                      </Typography>
                    )}
                    {teamLead.address && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{t("labour.address")}:</strong> {teamLead.address}
                      </Typography>
                    )}
                    {teamLead.village && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{t("auth.village")}:</strong> {teamLead.village}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", mt: 2 }}>
                      <Chip
                        label={t(`labour.${teamLead.preferredLanguage}`)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={teamLead.isApproved ? "Approved" : "Pending"}
                        size="small"
                        color={teamLead.isApproved ? "success" : "warning"}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <IconButton color="primary" onClick={() => handleOpenDialog("edit", teamLead)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setTeamLeadToDelete(teamLead._id)
                        setOpenConfirmDialog(true)
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {!teamLead.isApproved && (
                    <Button
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      variant="outlined"
                      color="success"
                      onClick={() => {
                        setTeamLeadToApprove(teamLead._id)
                        setOpenApproveDialog(true)
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Team Lead Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{dialogMode === "add" ? "Add Team Lead" : "Edit Team Lead"}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t("auth.name")}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="mobileNumber"
                  name="mobileNumber"
                  label={t("auth.mobileNumber")}
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                  disabled={dialogMode === "edit"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label={t("auth.email")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              {dialogMode === "add" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label={t("auth.password")}
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label={t("auth.address")}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="village"
                  name="village"
                  label={t("auth.village")}
                  value={formik.values.village}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.village && Boolean(formik.errors.village)}
                  helperText={formik.touched.village && formik.errors.village}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}
                >
                  <InputLabel id="preferredLanguage-label">{t("labour.preferredLanguage")}</InputLabel>
                  <Select
                    labelId="preferredLanguage-label"
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formik.values.preferredLanguage}
                    label={t("labour.preferredLanguage")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="telugu">{t("labour.telugu")}</MenuItem>
                    <MenuItem value="english">{t("labour.english")}</MenuItem>
                  </Select>
                  {formik.touched.preferredLanguage && formik.errors.preferredLanguage && (
                    <FormHelperText>{formik.errors.preferredLanguage}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="isApproved-label">Approval Status</InputLabel>
                  <Select
                    labelId="isApproved-label"
                    id="isApproved"
                    name="isApproved"
                    value={formik.values.isApproved}
                    label="Approval Status"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="true">Approved</MenuItem>
                    <MenuItem value="false">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }} fullWidth>
                  {profileImage ? t("labour.uploadImage") + " ✓" : t("labour.uploadImage")}
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {profileImage && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "4px" }}
                    />
                  </Box>
                )}
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title="Delete Team Lead"
        message="Are you sure you want to delete this team lead? This action cannot be undone."
        onConfirm={handleDeleteTeamLead}
        onCancel={() => {
          setOpenConfirmDialog(false)
          setTeamLeadToDelete(null)
        }}
        confirmText={t("common.delete")}
        confirmColor="error"
      />

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        open={openApproveDialog}
        title="Approve Team Lead"
        message="Are you sure you want to approve this team lead?"
        onConfirm={handleApproveTeamLead}
        onCancel={() => {
          setOpenApproveDialog(false)
          setTeamLeadToApprove(null)
        }}
        confirmText="Approve"
        confirmColor="success"
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

export default TeamLeads