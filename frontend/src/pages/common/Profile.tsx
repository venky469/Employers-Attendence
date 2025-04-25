"use client"

import type React from "react"

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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  CircularProgress,
} from "@mui/material"
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/common/PageHeader"
import LoadingButton from "../../components/common/LoadingButton"

const Profile = () => {
  const { t } = useTranslation()
  const { user, updateUser, loading } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null)
  const [uploading, setUploading] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string().required(t("auth.name") + " " + t("common.error")),
    email: Yup.string().email(t("auth.email") + " " + t("common.error")),
    address: Yup.string(),
    village: Yup.string(),
    preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
  })

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      village: user?.village || "",
      preferredLanguage: user?.preferredLanguage || "telugu",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const userData = {
          ...values,
          profileImageBase64: profileImage !== user?.profileImage ? profileImage : undefined,
        }
        await updateUser(userData)
      } catch (error) {
        // Error is handled by the API interceptor
      }
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title={t("auth.profile")} />

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                src={profileImage || undefined}
                alt={user.name}
                sx={{ width: 150, height: 150, mb: 2, bgcolor: "primary.main" }}
              >
                {user.name.charAt(0)}
              </Avatar>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
                disabled={uploading}
              >
                {uploading ? t("common.uploading") : t("labour.uploadImage")}
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
                {t("auth.role")}: {t(`auth.${user.role.toLowerCase()}`)}
              </Typography>

              {user.role === "teamLead" && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  {t("auth.status")}:{" "}
                  {user.isApproved ? (
                    <span style={{ color: "green" }}>{t("auth.approved")}</span>
                  ) : (
                    <span style={{ color: "orange" }}>{t("auth.pending")}</span>
                  )}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {t("auth.personalInfo")}
              </Typography>
              <Divider sx={{ mb: 3 }} />

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

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="mobileNumber"
                    name="mobileNumber"
                    label={t("auth.mobileNumber")}
                    value={user.mobileNumber}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
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
                    multiline
                    rows={2}
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
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {t("common.save")}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default Profile
