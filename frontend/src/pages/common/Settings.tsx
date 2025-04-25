"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../utils/api"
import PageHeader from "../../components/common/PageHeader"
import LoadingButton from "../../components/common/LoadingButton"
import { toast } from "react-toastify"

const Settings = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(t("auth.currentPassword") + " " + t("common.error")),
      newPassword: Yup.string()
        .min(6, t("auth.passwordLength"))
        .required(t("auth.newPassword") + " " + t("common.error")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], t("auth.passwordMatch"))
        .required(t("auth.confirmPassword") + " " + t("common.error")),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        await api.put("/auth/updatepassword", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
        toast.success(t("auth.passwordUpdateSuccess"))
        resetForm()
      } catch (error) {
        // Error is handled by the API interceptor
      } finally {
        setLoading(false)
      }
    },
  })

  const languageFormik = useFormik({
    initialValues: {
      language: i18n.language === "te" ? "telugu" : "english",
    },
    onSubmit: (values) => {
      const langCode = values.language === "telugu" ? "te" : "en"
      i18n.changeLanguage(langCode)
      toast.success(t("settings.languageChanged"))
    },
  })

  return (
    <Box>
      <PageHeader title={t("navigation.settings")} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.changePassword")}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={passwordFormik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="currentPassword"
                    name="currentPassword"
                    label={t("auth.currentPassword")}
                    type={showPassword ? "text" : "password"}
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                    helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="newPassword"
                    name="newPassword"
                    label={t("auth.newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                    helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t("auth.confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                    helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  disabled={!passwordFormik.isValid || passwordFormik.isSubmitting}
                >
                  {t("common.save")}
                </LoadingButton>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.language")}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={languageFormik.handleSubmit}>
              <FormControl fullWidth>
                <InputLabel id="language-label">{t("settings.selectLanguage")}</InputLabel>
                <Select
                  labelId="language-label"
                  id="language"
                  name="language"
                  value={languageFormik.values.language}
                  label={t("settings.selectLanguage")}
                  onChange={languageFormik.handleChange}
                >
                  <MenuItem value="telugu">{t("labour.telugu")}</MenuItem>
                  <MenuItem value="english">{t("labour.english")}</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  {t("common.save")}
                </Button>
              </Box>
            </form>
          </Paper>

          {user?.role === "admin" && (
            <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t("settings.systemSettings")}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Alert severity="info" sx={{ mb: 2 }}>
                {t("settings.systemSettingsInfo")}
              </Alert>

              <Button variant="outlined" fullWidth>
                {t("settings.backupData")}
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings
