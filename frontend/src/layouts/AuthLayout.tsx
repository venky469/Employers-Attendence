import { Outlet } from "react-router-dom"
import { Container, Box, Paper, Typography, useTheme as useMuiTheme } from "@mui/material"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "../components/common/LanguageSwitcher"

const AuthLayout = () => {
  const { t } = useTranslation()
  const theme = useMuiTheme()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <LanguageSwitcher />
      </Box>
      <Container component="main" maxWidth="xs" sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
            {t("app.name")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            {t("app.tagline")}
          </Typography>
          <Outlet />
        </Paper>
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {t("app.name")}
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthLayout
