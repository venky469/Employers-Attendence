"use client"

import { Box, Typography, Paper, Button } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { HourglassEmpty } from "@mui/icons-material"

const PendingApproval = () => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <HourglassEmpty sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
        <Typography variant="h5" component="h1" gutterBottom>
          {t("auth.pendingApproval")}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t("auth.pendingApprovalMessage")}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
          {t("auth.backToLogin")}
        </Button>
      </Paper>
    </Box>
  )
}

export default PendingApproval
