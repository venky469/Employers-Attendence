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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import LoadingButton from "../../components/common/LoadingButton"

const AdminFarmers = () => {
  const { t } = useTranslation()
  const [farmers, setFarmers] = useState<any[]>([])
  const [teamLeads, setTeamLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openTeamLeadDialog, setOpenTeamLeadDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentFarmer, setCurrentFarmer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [farmerToDelete, setFarmerToDelete] = useState<string | null>(null)
  const [selectedTeamLead, setSelectedTeamLead] = useState<string>("")
  const [assignedTeamLeads, setAssignedTeamLeads] = useState<any[]>([])
  const [unassignedTeamLeads, setUnassignedTeamLeads] = useState<any[]>([])
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
    fetchTeamLeads()
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

  const fetchTeamLeads = async () => {
    try {
      const response = await api.get("/users")
      // Filter only approved team leads
      setTeamLeads(response.data.data.filter((user: any) => user.isApproved))
    } catch (error) {
      console.error("Error fetching team leads:", error)
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

  const handleOpenTeamLeadDialog = (farmer: any) => {
    setCurrentFarmer(farmer)
    setAssignedTeamLeads(teamLeads.filter((teamLead) => farmer.teamLeads.some((id: string) => id === teamLead._id)))
    setUnassignedTeamLeads(teamLeads.filter((teamLead) => !farmer.teamLeads.some((id: string) => id === teamLead._id)))
    setOpenTeamLeadDialog(true)
  }

  const handleCloseTeamLeadDialog = () => {
    setOpenTeamLeadDialog(false)
    setSelectedTeamLead("")
  }

  const handleDeleteFarmer = async () => {
    if (!farmerToDelete) return

    try {
      await api.delete(`/farmers/${farmerToDelete}`)
      setSnackbar({
        open: true,
        message: t("farmer.deleteSuccess"),
        severity: "success",
      })
      fetchFarmers()
    } catch (error) {
      console.error("Error deleting farmer:", error)
      setSnackbar({
        open: true,
        message: "Error deleting farmer",
        severity: "error",
      })
    } finally {
      setOpenConfirmDialog(false)
      setFarmerToDelete(null)
    }
  }

  const handleAssignTeamLead = async () => {
    if (!selectedTeamLead || !currentFarmer) return

    try {
      await api.put(`/farmers/${currentFarmer._id}/assign-team-lead/${selectedTeamLead}`)
      setSnackbar({
        open: true,
        message: t("farmer.assignTeamLead") + " " + t("common.success"),
        severity: "success",
      })

      // Update local state
      const teamLead = teamLeads.find((tl) => tl._id === selectedTeamLead)
      if (teamLead) {
        setAssignedTeamLeads([...assignedTeamLeads, teamLead])
        setUnassignedTeamLeads(unassignedTeamLeads.filter((tl) => tl._id !== selectedTeamLead))
      }

      setSelectedTeamLead("")
      fetchFarmers() // Refresh data
    } catch (error) {
      console.error("Error assigning team lead:", error)
      setSnackbar({
        open: true,
        message: "Error assigning team lead",
        severity: "error",
      })
    }
  }

  const handleRemoveTeamLead = async (teamLeadId: string) => {
    if (!currentFarmer) return

    try {
      await api.put(`/farmers/${currentFarmer._id}/remove-team-lead/${teamLeadId}`)
      setSnackbar({
        open: true,
        message: t("farmer.removeTeamLead") + " " + t("common.success"),
        severity: "success",
      })

      // Update local state
      const teamLead = teamLeads.find((tl) => tl._id === teamLeadId)
      if (teamLead) {
        setUnassignedTeamLeads([...unassignedTeamLeads, teamLead])
        setAssignedTeamLeads(assignedTeamLeads.filter((tl) => tl._id !== teamLeadId))
      }

      fetchFarmers() // Refresh data
    } catch (error) {
      console.error("Error removing team lead:", error)
      setSnackbar({
        open: true,
        message: "Error removing team lead",
        severity: "error",
      })
    }
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
                  <Box>
                    <IconButton color="primary" onClick={() => handleOpenDialog("edit", farmer)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setFarmerToDelete(farmer._id)
                        setOpenConfirmDialog(true)
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      startIcon={<PersonAddIcon />}
                      variant="outlined"
                      onClick={() => handleOpenTeamLeadDialog(farmer)}
                    >
                      {t("farmer.teamLeads")}
                    </Button>
                  </Box>
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

      {/* Team Lead Assignment Dialog */}
      <Dialog open={openTeamLeadDialog} onClose={handleCloseTeamLeadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t("farmer.teamLeads")}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            {currentFarmer?.name}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            {t("common.assigned")}
          </Typography>
          {assignedTeamLeads.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("common.noData")}
            </Typography>
          ) : (
            <List dense sx={{ mb: 2 }}>
              {assignedTeamLeads.map((teamLead) => (
                <ListItem
                  key={teamLead._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveTeamLead(teamLead._id)}
                      color="error"
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={teamLead.profileImage}>{teamLead.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={teamLead.name} secondary={teamLead.mobileNumber} />
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            {t("common.add")} {t("auth.teamLead")}
          </Typography>
          <Box sx={{ display: "flex", mt: 1 }}>
            <FormControl fullWidth sx={{ mr: 1 }}>
              <InputLabel id="team-lead-label">{t("auth.teamLead")}</InputLabel>
              <Select
                labelId="team-lead-label"
                value={selectedTeamLead}
                label={t("auth.teamLead")}
                onChange={(e) => setSelectedTeamLead(e.target.value)}
              >
                {unassignedTeamLeads.map((teamLead) => (
                  <MenuItem key={teamLead._id} value={teamLead._id}>
                    {teamLead.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAssignTeamLead}
              disabled={!selectedTeamLead}
            >
              {t("common.add")}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamLeadDialog}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={openConfirmDialog}
        title={t("farmer.deleteFarmer")}
        message={t("farmer.deleteConfirm")}
        onConfirm={handleDeleteFarmer}
        onCancel={() => {
          setOpenConfirmDialog(false)
          setFarmerToDelete(null)
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

export default AdminFarmers
