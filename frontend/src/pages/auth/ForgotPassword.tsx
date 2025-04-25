"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { TextField, Button, Box, Typography, Alert, Paper } from "@mui/material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import LoadingButton from "../../components/common/LoadingButton"

const ForgotPassword = () => {
  const { t } = useTranslation()
  const { resetPassword, loading } = useAuth()
  const [success, setSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
    }),
    onSubmit: async (values) => {
      try {
        await resetPassword(values.mobileNumber)
        setSuccess(true)
      } catch (error) {
        // Error is handled by the API interceptor
      }
    },
  })

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {t("auth.forgotPassword")}
      </Typography>

      {success ? (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {t("auth.resetPasswordSuccess")}
          </Alert>
          <Typography variant="body2" paragraph>
            {t("auth.resetPasswordInstructions")}
          </Typography>
          <Button component={Link} to="/login" variant="contained" fullWidth>
            {t("auth.backToLogin")}
          </Button>
        </Paper>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          {/* <Typography variant="body2" sx={{ mb: 3 }}>
            {t("auth.forgotPasswordInstructions")}
          </Typography> */}

          <TextField
            margin="normal"
            fullWidth
            id="mobileNumber"
            label={t("auth.mobileNumber")}
            name="mobileNumber"
            autoComplete="tel"
            autoFocus
            value={formik.values.mobileNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
            helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
          />

          <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t("auth.resetPassword")}
          </LoadingButton>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button component={Link} to="/login" variant="text" size="small">
              {t("auth.backToLogin")}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}

export default ForgotPassword
