"use client"

import { Box, Typography, Button, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const handleGoBack = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin")
      } else if (user?.role === "teamLead") {
        navigate("/team-lead")
      } else {
        navigate("/")
      }
    } else {
      navigate("/login")
    }
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
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 500,
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: "8rem", fontWeight: "bold", color: "primary.main" }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: "center" }}>
          {t("common.error")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
          {t("common.noData")}
        </Typography>
        <Button variant="contained" onClick={handleGoBack}>
          {t("common.back")}
        </Button>
      </Paper>
    </Box>
  )
}

export default NotFound
