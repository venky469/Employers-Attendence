"use client"

import type React from "react"

import { Typography, Box, Breadcrumbs, Link as MuiLink, Button, useTheme } from "@mui/material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface PageHeaderProps {
  title: string
  breadcrumbs?: { text: string; link?: string }[]
  action?: {
    text: string
    icon?: React.ReactNode
    onClick: () => void
  }
}

const PageHeader = ({ title, breadcrumbs, action }: PageHeaderProps) => {
  const theme = useTheme()
  useTranslation()

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" component="h1" fontWeight="bold">
          {title}
        </Typography>
        {action && (
          <Button
            variant="contained"
            color="primary"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{ borderRadius: 2 }}
          >
            {action.text}
          </Button>
        )}
      </Box>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return isLast ? (
              <Typography key={index} color="text.primary">
                {crumb.text}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={Link}
                to={crumb.link || "#"}
                underline="hover"
                color="inherit"
                sx={{ "&:hover": { color: theme.palette.primary.main } }}
              >
                {crumb.text}
              </MuiLink>
            )
          })}
        </Breadcrumbs>
      )}
    </Box>
  )
}

export default PageHeader
