"use client"

import type React from "react"

import { Button, CircularProgress } from "@mui/material"

interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  onClick?: () => void
  variant?: "text" | "outlined" | "contained"
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  fullWidth?: boolean
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  sx?: any
}

const LoadingButton = ({
  loading,
  children,
  onClick,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  type = "button",
  disabled = false,
  startIcon,
  endIcon,
  sx,
}: LoadingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      type={type}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      sx={{ position: "relative", ...sx }}
    >
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>{children}</span>
    </Button>
  )
}

export default LoadingButton
