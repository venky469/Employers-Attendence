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
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  EventNote as EventNoteIcon,
  Agriculture as AgricultureIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import LoadingButton from "../../components/common/LoadingButton"

const Projects = () => {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<any[]>([])
  const [farmers, setFarmers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  })

  const validationSchema = Yup.object({
    name: Yup.string().required(t("project.name") + " " + t("common.error")),
    type: Yup.string().required(t("project.type") + " " + t("common.error")),
    description: Yup.string(),
    startDate: Yup.date().required(t("project.startDate") + " " + t("common.error")),
    endDate: Yup.date().nullable(),
    dailyWageRate: Yup.number()
      .required(t("project.dailyWageRate") + " " + t("common.error"))
      .min(1),
    farmer: Yup.string().required(t("project.farmer") + " " + t("common.error")),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      description: "",
      startDate: new Date(),
      endDate: null as Date | null,
      dailyWageRate: "",
      farmer: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
          dailyWageRate: Number(values.dailyWageRate),
        }

        if (dialogMode === "add") {
          await api.post("/projects", formData)
          setSnackbar({
            open: true,
            message: t("project.addSuccess"),
            severity: "success",
          })
        } else {
          await api.put(`/projects/${currentProject._id}`, formData)
          setSnackbar({
            open: true,
            message: t("project.updateSuccess"),
            severity: "success",
          })
        }

        fetchProjects()
        handleCloseDialog()
      } catch (error) {
        console.error("Error saving project:", error)
        setSnackbar({
          open: true,
          message: "Error saving project",
          severity: "error",
        })
      }
    },
  })

  useEffect(() => {
    fetchProjects()
    fetchFarmers()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get("/projects")
      setProjects(response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setSnackbar({
        open: true,
        message: "Error fetching projects",
        severity: "error",
      })
    } finally {
      setLoading(false)
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

  const handleOpenDialog = (mode: "add" | "edit", project?: any) => {
    setDialogMode(mode)
    if (mode === "edit" && project) {
      setCurrentProject(project)
      formik.setValues({
        name: project.name || "",
        type: project.type || "",
        description: project.description || "",
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : null,
        dailyWageRate: project.dailyWageRate?.toString() || "",
        farmer: project.farmer._id || "",
        isActive: project.isActive !== undefined ? project.isActive : true,
      })
    } else {
      formik.resetForm()
      setCurrentProject(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    formik.resetForm()
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      await api.delete(`/projects/${projectToDelete}`)
      setSnackbar({
        open: true,
        message: t("project.deleteSuccess"),
        severity: "success",
      })
      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      setSnackbar({
        open: true,
        message: "Error deleting project",
        severity: "error",
      })
    } finally {
      setOpenConfirmDialog(false)
      setProjectToDelete(null)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case "sowing":
        return "primary"
      case "harvesting":
        return "success"
      case "weeding":
        return "warning"
      case "fertilizing":
        return "info"
      case "irrigation":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Box>
      <PageHeader
        title={t("navigation.projects")}
        action={{
          text: t("project.addProject"),
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
      ) : filteredProjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="body1">{t("common.noData")}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {project.name}
                    </Typography>
                    <Chip label={t(`project.${project.type}`)} size="small" color={getProjectTypeColor(project.type)} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AgricultureIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2">{project.farmer.name}</Typography>
                  </Box>

                  {project.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("project.startDate")}
                      </Typography>
                      <Typography variant="body2">{new Date(project.startDate).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("project.endDate")}
                      </Typography>
                      <Typography variant="body2">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        {t("project.dailyWageRate")}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{project.dailyWageRate.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: "flex", mt: 2 }}>
                    <Chip
                      label={project.isActive ? t("common.yes") : t("common.no")}
                      size="small"
                      color={project.isActive ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Box>
                    <IconButton color="primary" onClick={() => handleOpenDialog("edit", project)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setProjectToDelete(project._id)
                        setOpenConfirmDialog(true)
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<EventNoteIcon />}
                    variant="outlined"
                    onClick={() => {
                      // Navigate to attendance view for this project
                      // This would be implemented in a real app
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

      {/* Add/Edit Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{dialogMode === "add" ? t("project.addProject") : t("project.editProject")}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t("project.name")}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                  <InputLabel id="type-label">{t("project.type")}</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formik.values.type}
                    label={t("project.type")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="sowing">{t("project.sowing")}</MenuItem>
                    <MenuItem value="harvesting">{t("project.harvesting")}</MenuItem>
                    <MenuItem value="weeding">{t("project.weeding")}</MenuItem>
                    <MenuItem value="fertilizing">{t("project.fertilizing")}</MenuItem>
                    <MenuItem value="irrigation">{t("project.irrigation")}</MenuItem>
                    <MenuItem value="other">{t("project.other")}</MenuItem>
                  </Select>
                  {formik.touched.type && formik.errors.type && <FormHelperText>{formik.errors.type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.farmer && Boolean(formik.errors.farmer)}>
                  <InputLabel id="farmer-label">{t("project.farmer")}</InputLabel>
                  <Select
                    labelId="farmer-label"
                    id="farmer"
                    name="farmer"
                    value={formik.values.farmer}
                    label={t("project.farmer")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {farmers.map((farmer) => (
                      <MenuItem key={farmer._id} value={farmer._id}>
                        {farmer.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.farmer && formik.errors.farmer && (
                    <FormHelperText>{formik.errors.farmer}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label={t("project.description")}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("project.startDate")}
                    value={formik.values.startDate}
                    onChange={(newValue) => formik.setFieldValue("startDate", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && (typeof formik.errors.startDate === 'string' ? formik.errors.startDate : ''),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("project.endDate")}
                    value={formik.values.endDate}
                    onChange={(newValue) => formik.setFieldValue("endDate", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && formik.errors.endDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dailyWageRate"
                  name="dailyWageRate"
                  label={t("project.dailyWageRate")}
                  type="number"
                  value={formik.values.dailyWageRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dailyWageRate && Boolean(formik.errors.dailyWageRate)}
                  helperText={formik.touched.dailyWageRate && formik.errors.dailyWageRate}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="isActive-label">{t("project.isActive")}</InputLabel>
                  <Select
                    labelId="isActive-label"
                    id="isActive"
                    name="isActive"
                    value={formik.values.isActive}
                    label={t("project.isActive")}
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title={t("project.deleteProject")}
        message={t("project.deleteConfirm")}
        onConfirm={handleDeleteProject}
        onCancel={() => {
          setOpenConfirmDialog(false)
          setProjectToDelete(null)
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

export default Projects
