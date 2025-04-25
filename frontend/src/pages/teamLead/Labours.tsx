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
// } from "@mui/material"
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   CloudUpload as CloudUploadIcon,
//   EventNote as EventNoteIcon,
// } from "@mui/icons-material"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import { api } from "../../utils/api"
// import PageHeader from "../../components/common/PageHeader"
// import ConfirmDialog from "../../components/common/ConfirmDialog"
// import LoadingButton from "../../components/common/LoadingButton"

// const Labours = () => {
//   const { t } = useTranslation()
//   const [labours, setLabours] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [openDialog, setOpenDialog] = useState(false)
//   const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
//   const [currentLabour, setCurrentLabour] = useState<any>(null)
//   const [profileImage, setProfileImage] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
//   const [labourToDelete, setLabourToDelete] = useState<string | null>(null)
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error",
//   })

//   const validationSchema = Yup.object({
//     name: Yup.string().required(t("labour.name") + " " + t("common.error")),
//     mobileNumber: Yup.string(),
//     address: Yup.string(),
//     age: Yup.number().min(18).max(100),
//     gender: Yup.string(),
//     preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
//   })

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       mobileNumber: "",
//       address: "",
//       age: "",
//       gender: "",
//       preferredLanguage: "telugu",
//       isActive: true,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const formData = {
//           ...values,
//           age: values.age ? Number(values.age) : undefined,
//           profileImageBase64: profileImage,
//         }

//         if (dialogMode === "add") {
//           await api.post("/labours", formData)
//           setSnackbar({
//             open: true,
//             message: t("labour.addSuccess"),
//             severity: "success",
//           })
//         } else {
//           await api.put(`/labours/${currentLabour._id}`, formData)
//           setSnackbar({
//             open: true,
//             message: t("labour.updateSuccess"),
//             severity: "success",
//           })
//         }

//         fetchLabours()
//         handleCloseDialog()
//       } catch (error) {
//         console.error("Error saving labour:", error)
//         setSnackbar({
//           open: true,
//           message: "Error saving labour",
//           severity: "error",
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     fetchLabours()
//   }, [])

//   const fetchLabours = async () => {
//     try {
//       setLoading(true)
//       const response = await api.get("/labours")
//       setLabours(response.data.data)
//     } catch (error) {
//       console.error("Error fetching labours:", error)
//       setSnackbar({
//         open: true,
//         message: "Error fetching labours",
//         severity: "error",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleOpenDialog = (mode: "add" | "edit", labour?: any) => {
//     setDialogMode(mode)
//     if (mode === "edit" && labour) {
//       setCurrentLabour(labour)
//       formik.setValues({
//         name: labour.name || "",
//         mobileNumber: labour.mobileNumber || "",
//         address: labour.address || "",
//         age: labour.age?.toString() || "",
//         gender: labour.gender || "",
//         preferredLanguage: labour.preferredLanguage || "telugu",
//         isActive: labour.isActive !== undefined ? labour.isActive : true,
//       })
//       setProfileImage(labour.profileImage || null)
//     } else {
//       formik.resetForm()
//       setProfileImage(null)
//       setCurrentLabour(null)
//     }
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     formik.resetForm()
//     setProfileImage(null)
//   }

//   const handleDeleteLabour = async () => {
//     if (!labourToDelete) return

//     try {
//       await api.delete(`/labours/${labourToDelete}`)
//       setSnackbar({
//         open: true,
//         message: t("labour.deleteSuccess"),
//         severity: "success",
//       })
//       fetchLabours()
//     } catch (error) {
//       console.error("Error deleting labour:", error)
//       setSnackbar({
//         open: true,
//         message: "Error deleting labour",
//         severity: "error",
//       })
//     } finally {
//       setOpenConfirmDialog(false)
//       setLabourToDelete(null)
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

//   const filteredLabours = labours.filter(
//     (labour) =>
//       labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (labour.mobileNumber && labour.mobileNumber.includes(searchTerm)),
//   )

//   return (
//     <Box>
//       <PageHeader
//         title={t("navigation.labours")}
//         action={{
//           text: t("labour.addLabour"),
//           icon: <AddIcon />,
//           onClick: () => handleOpenDialog("add"),
//         }}
//       />

//       <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <TextField
//           fullWidth
//           placeholder={t("common.search")}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Paper>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : filteredLabours.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
//           <Typography variant="body1">{t("common.noData")}</Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredLabours.map((labour) => (
//             <Grid item xs={12} sm={6} md={4} key={labour._id}>
//               <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Avatar
//                       src={labour.profileImage}
//                       alt={labour.name}
//                       sx={{ width: 56, height: 56, mr: 2, bgcolor: "primary.main" }}
//                     >
//                       {labour.name.charAt(0)}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6" component="div">
//                         {labour.name}
//                       </Typography>
//                       {labour.mobileNumber && (
//                         <Typography variant="body2" color="text.secondary">
//                           {labour.mobileNumber}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>

//                   <Box sx={{ mt: 2 }}>
//                     {labour.address && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>{t("labour.address")}:</strong> {labour.address}
//                       </Typography>
//                     )}
//                     {labour.age && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>{t("labour.age")}:</strong> {labour.age}
//                       </Typography>
//                     )}
//                     {labour.gender && (
//                       <Typography variant="body2" sx={{ mb: 1 }}>
//                         <strong>{t("labour.gender")}:</strong> {t(`labour.${labour.gender.toLowerCase()}`)}
//                       </Typography>
//                     )}
//                     <Box sx={{ display: "flex", mt: 2 }}>
//                       <Chip
//                         label={t(`labour.${labour.preferredLanguage}`)}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                         sx={{ mr: 1 }}
//                       />
//                       <Chip
//                         label={labour.isActive ? t("common.yes") : t("common.no")}
//                         size="small"
//                         color={labour.isActive ? "success" : "error"}
//                         variant="outlined"
//                       />
//                     </Box>
//                   </Box>
//                 </CardContent>
//                 <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
//                   <Box>
//                     <IconButton color="primary" onClick={() => handleOpenDialog("edit", labour)} size="small">
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => {
//                         setLabourToDelete(labour._id)
//                         setOpenConfirmDialog(true)
//                       }}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Box>
//                   <Button
//                     size="small"
//                     startIcon={<EventNoteIcon />}
//                     variant="outlined"
//                     onClick={() => {
//                       // Navigate to attendance view for this labour
//                       // This would be implemented in a real app
//                     }}
//                   >
//                     {t("labour.viewAttendance")}
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Add/Edit Labour Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogTitle>{dialogMode === "add" ? t("labour.addLabour") : t("labour.editLabour")}</DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   id="name"
//                   name="name"
//                   label={t("labour.name")}
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
//                   label={t("labour.mobileNumber")}
//                   value={formik.values.mobileNumber}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
//                   helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   id="age"
//                   name="age"
//                   label={t("labour.age")}
//                   type="number"
//                   value={formik.values.age}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.age && Boolean(formik.errors.age)}
//                   helperText={formik.touched.age && formik.errors.age}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   id="address"
//                   name="address"
//                   label={t("labour.address")}
//                   value={formik.values.address}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.address && Boolean(formik.errors.address)}
//                   helperText={formik.touched.address && formik.errors.address}
//                   multiline
//                   rows={2}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
//                   <InputLabel id="gender-label">{t("labour.gender")}</InputLabel>
//                   <Select
//                     labelId="gender-label"
//                     id="gender"
//                     name="gender"
//                     value={formik.values.gender}
//                     label={t("labour.gender")}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   >
//                     <MenuItem value="male">{t("labour.male")}</MenuItem>
//                     <MenuItem value="female">{t("labour.female")}</MenuItem>
//                     <MenuItem value="other">{t("labour.other")}</MenuItem>
//                   </Select>
//                   {formik.touched.gender && formik.errors.gender && (
//                     <FormHelperText>{formik.errors.gender}</FormHelperText>
//                   )}
//                 </FormControl>
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
//               <Grid item xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel id="isActive-label">{t("labour.isActive")}</InputLabel>
//                   <Select
//                     labelId="isActive-label"
//                     id="isActive"
//                     name="isActive"
//                     value={formik.values.isActive}
//                     label={t("labour.isActive")}
//                     onChange={formik.handleChange}
//                   >
//                     <MenuItem value={true}>{t("common.yes")}</MenuItem>
//                     <MenuItem value={false}>{t("common.no")}</MenuItem>
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
//         title={t("labour.deleteLabour")}
//         message={t("labour.deleteConfirm")}
//         onConfirm={handleDeleteLabour}
//         onCancel={() => {
//           setOpenConfirmDialog(false)
//           setLabourToDelete(null)
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

// export default Labours






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
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import LoadingButton from "../../components/common/LoadingButton"

const Labours = () => {
  const { t } = useTranslation()
  const [labours, setLabours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentLabour, setCurrentLabour] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [labourToDelete, setLabourToDelete] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const validationSchema = Yup.object({
    name: Yup.string().required(t("labour.name") + " " + t("common.error")),
    mobileNumber: Yup.string(),
    address: Yup.string(),
    age: Yup.number().min(18).max(100),
    gender: Yup.string(),
    preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      mobileNumber: "",
      address: "",
      age: "",
      gender: "",
      preferredLanguage: "telugu",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          age: values.age ? Number(values.age) : undefined,
          profileImageBase64: profileImage,
        }

        if (dialogMode === "add") {
          await api.post("/labours", formData)
          setSnackbar({
            open: true,
            message: t("labour.addSuccess"),
            severity: "success",
          })
        } else {
          await api.put(`/labours/${currentLabour._id}`, formData)
          setSnackbar({
            open: true,
            message: t("labour.updateSuccess"),
            severity: "success",
          })
        }

        fetchLabours()
        handleCloseDialog()
      } catch (error) {
        console.error("Error saving labour:", error)
        setSnackbar({
          open: true,
          message: "Error saving labour",
          severity: "error",
        })
      }
    },
  })

  useEffect(() => {
    fetchLabours()
  }, [])

  const fetchLabours = async () => {
    try {
      setLoading(true)
      const response = await api.get("/labours")
      setLabours(response.data.data)
    } catch (error) {
      console.error("Error fetching labours:", error)
      setSnackbar({
        open: true,
        message: "Error fetching labours",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (mode: "add" | "edit", labour?: any) => {
    setDialogMode(mode)
    if (mode === "edit" && labour) {
      setCurrentLabour(labour)
      formik.setValues({
        name: labour.name || "",
        mobileNumber: labour.mobileNumber || "",
        address: labour.address || "",
        age: labour.age?.toString() || "",
        gender: labour.gender || "",
        preferredLanguage: labour.preferredLanguage || "telugu",
        isActive: labour.isActive !== undefined ? labour.isActive : true,
      })
      setProfileImage(labour.profileImage || null)
    } else {
      formik.resetForm()
      setProfileImage(null)
      setCurrentLabour(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    formik.resetForm()
    setProfileImage(null)
  }

  const handleDeleteLabour = async () => {
    if (!labourToDelete) return

    try {
      await api.delete(`/labours/${labourToDelete}`)
      setSnackbar({
        open: true,
        message: t("labour.deleteSuccess"),
        severity: "success",
      })
      fetchLabours()
    } catch (error) {
      console.error("Error deleting labour:", error)
      setSnackbar({
        open: true,
        message: "Error deleting labour",
        severity: "error",
      })
    } finally {
      setOpenConfirmDialog(false)
      setLabourToDelete(null)
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

  const filteredLabours = labours.filter(
    (labour) =>
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labour.mobileNumber && labour.mobileNumber.includes(searchTerm)),
  )

  return (
    <Box>
      <PageHeader
        title={t("navigation.labours")}
        action={{
          text: t("labour.addLabour"),
          icon: <AddIcon />,
          onClick: () => handleOpenDialog("add"),
        }}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
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
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredLabours.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="body1">{t("common.noData")}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredLabours.map((labour) => (
            <Grid item xs={12} sm={6} md={4} key={labour._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.1)", // Glassmorphism background
                  backdropFilter: "blur(10px)", // Glassmorphism blur
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      src={labour.profileImage}
                      alt={labour.name}
                      sx={{
                        width: 64,
                        height: 64,
                        mr: 2,
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        bgcolor: "primary.main",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {labour.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {labour.name}
                      </Typography>
                      {labour.mobileNumber && (
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                          {labour.mobileNumber}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    {labour.address && (
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        <strong>{t("labour.address")}:</strong> {labour.address}
                      </Typography>
                    )}
 turkeys                    {labour.age && (
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        <strong>{t("labour.age")}:</strong> {labour.age}
                      </Typography>
                    )}
                    {labour.gender && (
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        <strong>{t("labour.gender")}:</strong> {t(`labour.${labour.gender.toLowerCase()}`)}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                      <Chip
                        label={t(`labour.${labour.preferredLanguage}`)}
                        size="small"
                        sx={{
                          bgcolor: "rgba(33, 150, 243, 0.1)",
                          color: "primary.main",
                          fontWeight: 500,
                          borderRadius: 1,
                          transition: "background 0.3s ease",
                          "&:hover": {
                            bgcolor: "rgba(33, 150, 243, 0.2)",
                          },
                        }}
                      />
                      <Chip
                        label={labour.isActive ? t("common.yes") : t("common.no")}
                        size="small"
                        sx={{
                          bgcolor: labour.isActive ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                          color: labour.isActive ? "success.main" : "error.main",
                          fontWeight: 500,
                          borderRadius: 1,
                          transition: "background 0.3s ease",
                          "&:hover": {
                            bgcolor: labour.isActive ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: "rgba(255, 255, 255, 0.05)" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog("edit", labour)}
                      size="small"
                      sx={{
                        bgcolor: "rgba(33, 150, 243, 0.1)",
                        "&:hover": { bgcolor: "rgba(33, 150, 243, 0.2)" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setLabourToDelete(labour._id)
                        setOpenConfirmDialog(true)
                      }}
                      size="small"
                      sx={{
                        bgcolor: "rgba(244, 67, 54, 0.1)",
                        "&:hover": { bgcolor: "rgba(244, 67, 54, 0.2)" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<EventNoteIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(33, 150, 243, 0.1)",
                      },
                    }}
                    onClick={() => {
                      // Navigate to attendance view for this labour
                    }}
                  >
                    {t("labour.viewAttendance")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Labour Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{dialogMode === "add" ? t("labour.addLabour") : t("labour.editLabour")}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t("labour.name")}
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
                  label={t("labour.mobileNumber")}
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label={t("labour.age")}
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label={t("labour.address")}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                  <InputLabel id="gender-label">{t("labour.gender")}</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    label={t("labour.gender")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="male">{t("labour.male")}</MenuItem>
                    <MenuItem value="female">{t("labour.female")}</MenuItem>
                    <MenuItem value="other">{t("labour.other")}</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="isActive-label">{t("labour.isActive")}</InputLabel>
                  <Select
                    labelId="isActive-label"
                    id="isActive"
                    name="isActive"
                    value={formik.values.isActive}
                    label={t("labour.isActive")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="true">{t("common.yes")}</MenuItem>
                    <MenuItem value="false">{t("common.no")}</MenuItem>
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
        title={t("labour.deleteLabour")}
        message={t("labour.deleteConfirm")}
        onConfirm={handleDeleteLabour}
        onCancel={() => {
          setOpenConfirmDialog(false)
          setLabourToDelete(null)
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

export default Labours
