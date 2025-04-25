// "use client"

// import { useState } from "react"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from "@mui/material"
// import { Visibility, VisibilityOff } from "@mui/icons-material"
// import { Link } from "react-router-dom"
// import { useTranslation } from "react-i18next"
// import { useAuth } from "../../contexts/AuthContext"
// import LoadingButton from "../../components/common/LoadingButton"

// const Login = () => {
//   const { t } = useTranslation()
//   const { login, loading, error, clearError } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)

//   const formik = useFormik({
//     initialValues: {
//       mobileNumber: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
//       password: Yup.string().required(t("auth.password") + " " + t("common.error")),
//     }),
//     onSubmit: (values) => {
//       login(values.mobileNumber, values.password)
//     },
//   })

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword)
//   }

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
//         {t("auth.login")}
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={formik.handleSubmit}>
//         <TextField
//           margin="normal"
//           fullWidth
//           id="mobileNumber"
//           label={t("auth.mobileNumber")}
//           name="mobileNumber"
//           autoComplete="tel"
//           autoFocus
//           value={formik.values.mobileNumber}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
//           helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
//         />
//         <TextField
//           margin="normal"
//           fullWidth
//           name="password"
//           label={t("auth.password")}
//           type={showPassword ? "text" : "password"}
//           id="password"
//           autoComplete="current-password"
//           value={formik.values.password}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           error={formik.touched.password && Boolean(formik.errors.password)}
//           helperText={formik.touched.password && formik.errors.password}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//           {t("auth.login")}
//         </LoadingButton>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//           <Button component={Link} to="/forgot-password" variant="text" size="small">
//             {t("auth.forgotPassword")}
//           </Button>
//           <Button component={Link} to="/register" variant="text" size="small">
//             {t("auth.register")}
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   )
// }

// export default Login




"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import LoadingButton from "../../components/common/LoadingButton"


const Login = () => {
  const { t } = useTranslation()
  const { login, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
      password: Yup.string().required(t("auth.password") + " " + t("common.error")),
    }),
    onSubmit: (values) => {
      login(values.mobileNumber, values.password)
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {t("auth.login")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
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
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label={t("auth.password")}
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {t("auth.login")}
        </LoadingButton>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Button component={Link} to="/forgot-password" variant="text" size="small">
            {t("auth.forgotPassword")}
          </Button>
          <Button component={Link} to="/register" variant="text" size="small">
            {t("auth.register")}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default Login