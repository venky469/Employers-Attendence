"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material"
import {
  Add as AddIcon,
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material"
import { api } from "../../utils/api"
import { useAuth } from "../../contexts/AuthContext"
import PageHeader from "../../components/common/PageHeader"

const TeamLeadDashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLabours: 0,
    totalFarmers: 0,
    totalProjects: 0,
    todayAttendance: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch this data from your API
        // For now, we'll simulate it

        // Fetch labours count
        const laboursResponse = await api.get("/labours")

        // Fetch farmers count
        const farmersResponse = await api.get("/farmers")

        // Fetch projects count
        const projectsResponse = await api.get("/projects")

        // Fetch today's attendance
        const today = new Date().toISOString().split("T")[0]
        const attendanceResponse = await api.get(`/attendance?date[gte]=${today}`)

        setStats({
          totalLabours: laboursResponse.data.count,
          totalFarmers: farmersResponse.data.count,
          totalProjects: projectsResponse.data.count,
          todayAttendance: attendanceResponse.data.count,
        })

        // Fetch recent activities (last 5 attendance records)
        const recentActivitiesResponse = await api.get("/attendance?sort=-createdAt&limit=5")
        setRecentActivities(recentActivitiesResponse.data.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  )

  const QuickAction = ({ title, icon, onClick }: { title: string; icon: React.ReactNode; onClick: () => void }) => (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={onClick}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        p: 2,
        height: "100%",
        borderRadius: 2,
        borderColor: theme.palette.divider,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: "rgba(0, 150, 136, 0.04)",
        },
      }}
    >
      {title}
    </Button>
  )

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title={`${t("dashboard.welcome")}, ${user?.name}!`} />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.totalLabours")}
            value={stats.totalLabours}
            icon={<PersonIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.totalFarmers")}
            value={stats.totalFarmers}
            icon={<AgricultureIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.totalProjects")}
            value={stats.totalProjects}
            icon={<AssignmentIcon />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.todayAttendance")}
            value={stats.todayAttendance}
            icon={<EventNoteIcon />}
            color="#F44336"
          />
        </Grid>

        {/* Quick Actions and Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {t("dashboard.quickActions")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title={t("dashboard.markAttendance")}
                  icon={<EventNoteIcon />}
                  onClick={() => navigate("/team-lead/attendance")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title={t("dashboard.addLabour")}
                  icon={<AddIcon />}
                  onClick={() => navigate("/team-lead/labours")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title={t("dashboard.addProject")}
                  icon={<AssignmentIcon />}
                  onClick={() => navigate("/team-lead/projects")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <QuickAction
                  title={t("dashboard.viewReports")}
                  icon={<BarChartIcon />}
                  onClick={() => navigate("/team-lead/reports")}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {t("dashboard.recentActivity")}
            </Typography>
            {recentActivities.length > 0 ? (
              <List>
                {recentActivities.map((activity, index) => (
                  <Box key={activity._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${activity.labour.name} - ${activity.project.name}`}
                        secondary={`${new Date(activity.date).toLocaleDateString()} | ${activity.isPresent ? t("common.yes") : t("common.no")}`}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("common.noData")}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TeamLeadDashboard
