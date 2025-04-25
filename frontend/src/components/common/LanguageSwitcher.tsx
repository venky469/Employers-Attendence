"use client"

import type React from "react"

import { useState } from "react"
import { IconButton, Menu, MenuItem, ListItemText } from "@mui/material"
import { Translate as TranslateIcon } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

interface LanguageSwitcherProps {
  color?: "inherit" | "primary" | "secondary" | "default"
}

const LanguageSwitcher = ({ color = "default" }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-label="change language"
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleMenu}
        color={color}
      >
        <TranslateIcon />
      </IconButton>
      <Menu id="language-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("te")} selected={i18n.language === "te"}>
          <ListItemText primary={t("settings.telugu")} />
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("en")} selected={i18n.language === "en"}>
          <ListItemText primary={t("settings.english")} />
        </MenuItem>
      </Menu>
    </>
  )
}

export default LanguageSwitcher
