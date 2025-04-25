"use client"

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
  Chip,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Divider,
  Avatar,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import LoadingButton from "../../components/common/LoadingButton"

const Farmers = () => {
  const { t } = useTranslation()
  const [farmers, setFarmers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentFarmer, setCurrentFarmer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const validationSchema = Yup.object({
    name: Yup.string().required(t("farmer.name") + " " + t("common.error")),
    mobileNumber: Yup.string(),
    village: Yup.string().required(t("farmer.village") + " " + t("common.error")),
    landDetails: Yup.string(),
    preferredLanguage: Yup.string().required(t("farmer.preferredLanguage") + " " + t("common.error")),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      mobileNumber: "",
      village: "",
      landDetails: "",
      preferredLanguage: "telugu",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
        }

        if (dialogMode === "add") {
          await api.post("/farmers", formData)
          setSnackbar({
            open: true,
            message: t("farmer.addSuccess"),
            severity: "success",
          })
        } else {
          await api.put(`/farmers/${currentFarmer._id}`, formData)
          setSnackbar({
            open: true,
            message: t("farmer.updateSuccess"),
            severity: "success",
          })
        }

        fetchFarmers()
        handleCloseDialog()
      } catch (error) {
        console.error("Error saving farmer:", error)
        setSnackbar({
          open: true,
          message: "Error saving farmer",
          severity: "error",
        })
      }
    },
  })

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/farmers")
      setFarmers(response.data.data)
    } catch (error) {
      console.error("Error fetching farmers:", error)
      setSnackbar({
        open: true,
        message: "Error fetching farmers",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (mode: "add" | "edit", farmer?: any) => {
    setDialogMode(mode)
    if (mode === "edit" && farmer) {
      setCurrentFarmer(farmer)
      formik.setValues({
        name: farmer.name || "",
        mobileNumber: farmer.mobileNumber || "",
        village: farmer.village || "",
        landDetails: farmer.landDetails || "",
        preferredLanguage: farmer.preferredLanguage || "telugu",
        isActive: farmer.isActive !== undefined ? farmer.isActive : true,
      })
    } else {
      formik.resetForm()
      setCurrentFarmer(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    formik.resetForm()
  }

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farmer.mobileNumber && farmer.mobileNumber.includes(searchTerm)),
  )

  return (
    <Box>
      <PageHeader
        title={t("navigation.farmers")}
        action={{
          text: t("farmer.addFarmer"),
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
      ) : filteredFarmers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="body1">{t("common.noData")}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredFarmers.map((farmer) => (
            <Grid item xs={12} sm={6} md={4} key={farmer._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{farmer.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {farmer.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {farmer.village}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {farmer.mobileNumber && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2">{farmer.mobileNumber}</Typography>
                    </Box>
                  )}

                  {farmer.landDetails && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>{t("farmer.landDetails")}:</strong> {farmer.landDetails}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t("farmer.teamLeads")}
                    </Typography>
                    <Typography variant="body2">
                      {farmer.teamLeads?.length || 0} {t("auth.teamLead")}(s)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", mt: 2 }}>
                    <Chip
                      label={t(`farmer.${farmer.preferredLanguage}`)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={farmer.isActive ? t("common.yes") : t("common.no")}
                      size="small"
                      color={farmer.isActive ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <IconButton color="primary" onClick={() => handleOpenDialog("edit", farmer)} size="small">
                    <EditIcon />
                  </IconButton>
                  <Button
                    size="small"
                    startIcon={<AssignmentIcon />}
                    variant="outlined"
                    onClick={() => {
                      // Navigate to projects view for this farmer
                      // This would be implemented in a real app
                    }}
                  >
                    {t("navigation.projects")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Farmer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{dialogMode === "add" ? t("farmer.addFarmer") : t("farmer.editFarmer")}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t("farmer.name")}
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
                  label={t("farmer.mobileNumber")}
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
                  id="village"
                  name="village"
                  label={t("farmer.village")}
                  value={formik.values.village}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.village && Boolean(formik.errors.village)}
                  helperText={formik.touched.village && formik.errors.village}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="landDetails"
                  name="landDetails"
                  label={t("farmer.landDetails")}
                  value={formik.values.landDetails}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.landDetails && Boolean(formik.errors.landDetails)}
                  helperText={formik.touched.landDetails && formik.errors.landDetails}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}
                >
                  <InputLabel id="preferredLanguage-label">{t("farmer.preferredLanguage")}</InputLabel>
                  <Select
                    labelId="preferredLanguage-label"
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formik.values.preferredLanguage}
                    label={t("farmer.preferredLanguage")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="telugu">{t("farmer.telugu")}</MenuItem>
                    <MenuItem value="english">{t("farmer.english")}</MenuItem>
                  </Select>
                  {formik.touched.preferredLanguage && formik.errors.preferredLanguage && (
                    <FormHelperText>{formik.errors.preferredLanguage}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="isActive-label">{t("farmer.isActive")}</InputLabel>
                  <Select
                    labelId="isActive-label"
                    id="isActive"
                    name="isActive"
                    value={formik.values.isActive}
                    label={t("farmer.isActive")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="true">{t("common.yes")}</MenuItem>
                    <MenuItem value="false">{t("common.no")}</MenuItem>
                  </Select>
                </FormControl>
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

export default Farmers
