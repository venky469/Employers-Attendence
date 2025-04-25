// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useFormik } from "formik"
// import * as Yup from "yup"
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Alert,
//   InputAdornment,
//   IconButton,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
// } from "@mui/material"
// import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material"
// import { Link } from "react-router-dom"
// import { useTranslation } from "react-i18next"
// import { useAuth } from "../../contexts/AuthContext"
// import LoadingButton from "../../components/common/LoadingButton"

// const Register = () => {
//   const { t } = useTranslation()
//   const { register, loading, error, clearError } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)
//   const [profileImage, setProfileImage] = useState<string | null>(null)

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       mobileNumber: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "teamLead",
//       address: "",
//       village: "",
//       preferredLanguage: "telugu",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required(t("auth.name") + " " + t("common.error")),
//       mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
//       email: Yup.string().email(t("auth.email") + " " + t("common.error")),
//       password: Yup.string()
//         .min(6, t("auth.password") + " " + t("common.error"))
//         .required(t("auth.password") + " " + t("common.error")),
//       confirmPassword: Yup.string()
//         .oneOf([Yup.ref("password")], t("auth.confirmPassword") + " " + t("common.error"))
//         .required(t("auth.confirmPassword") + " " + t("common.error")),
//       role: Yup.string().required(t("auth.role") + " " + t("common.error")),
//       preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
//     }),
//     onSubmit: (values) => {
//       const userData = {
//         ...values,
//         profileImageBase64: profileImage,
//       }
//       delete userData.confirmPassword
//       register(userData)
//     },
//   })

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword)
//   }

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
//         {t("auth.register")}
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={formik.handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="name"
//               label={t("auth.name")}
//               name="name"
//               autoComplete="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.name && Boolean(formik.errors.name)}
//               helperText={formik.touched.name && formik.errors.name}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="mobileNumber"
//               label={t("auth.mobileNumber")}
//               name="mobileNumber"
//               autoComplete="tel"
//               value={formik.values.mobileNumber}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
//               helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="email"
//               label={t("auth.email")}
//               name="email"
//               autoComplete="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.email && Boolean(formik.errors.email)}
//               helperText={formik.touched.email && formik.errors.email}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               name="password"
//               label={t("auth.password")}
//               type={showPassword ? "text" : "password"}
//               id="password"
//               autoComplete="new-password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               name="confirmPassword"
//               label={t("auth.confirmPassword")}
//               type={showPassword ? "text" : "password"}
//               id="confirmPassword"
//               autoComplete="new-password"
//               value={formik.values.confirmPassword}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
//               helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
//               <InputLabel id="role-label">{t("auth.role")}</InputLabel>
//               <Select
//                 labelId="role-label"
//                 id="role"
//                 name="role"
//                 value={formik.values.role}
//                 label={t("auth.role")}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               >
//                 <MenuItem value="admin">{t("auth.admin")}</MenuItem>
//                 <MenuItem value="teamLead">{t("auth.teamLead")}</MenuItem>
//               </Select>
//               {formik.touched.role && formik.errors.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="address"
//               label={t("auth.address")}
//               name="address"
//               value={formik.values.address}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.address && Boolean(formik.errors.address)}
//               helperText={formik.touched.address && formik.errors.address}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="village"
//               label={t("auth.village")}
//               name="village"
//               value={formik.values.village}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.village && Boolean(formik.errors.village)}
//               helperText={formik.touched.village && formik.errors.village}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}>
//               <InputLabel id="preferredLanguage-label">{t("labour.preferredLanguage")}</InputLabel>
//               <Select
//                 labelId="preferredLanguage-label"
//                 id="preferredLanguage"
//                 name="preferredLanguage"
//                 value={formik.values.preferredLanguage}
//                 label={t("labour.preferredLanguage")}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               >
//                 <MenuItem value="telugu">{t("labour.telugu")}</MenuItem>
//                 <MenuItem value="english">{t("labour.english")}</MenuItem>
//               </Select>
//               {formik.touched.preferredLanguage && formik.errors.preferredLanguage && (
//                 <FormHelperText>{formik.errors.preferredLanguage}</FormHelperText>
//               )}
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <Button component="label" variant="outlined" startIcon={<CloudUpload />} sx={{ mt: 1 }} fullWidth>
//               {profileImage ? t("labour.uploadImage") + " ✓" : t("labour.uploadImage")}
//               <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//             </Button>
//           </Grid>
//         </Grid>
//         <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//           {t("auth.register")}
//         </LoadingButton>
//         <Box sx={{ textAlign: "center" }}>
//           <Button component={Link} to="/login" variant="text" size="small">
//             {t("auth.login")}
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   )
// }

// export default Register





"use client"

import type React from "react"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material"
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import LoadingButton from "../../components/common/LoadingButton"

const Register = () => {
  const { t } = useTranslation()
  const { register, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "teamLead",
      address: "",
      village: "",
      preferredLanguage: "telugu",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("auth.name") + " " + t("common.error")),
      mobileNumber: Yup.string().required(t("auth.mobileNumber") + " " + t("common.error")),
      email: Yup.string().email(t("auth.email") + " " + t("common.error")),
      password: Yup.string()
        .min(6, t("auth.password") + " " + t("common.error"))
        .required(t("auth.password") + " " + t("common.error")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("auth.confirmPassword") + " " + t("common.error"))
        .required(t("auth.confirmPassword") + " " + t("common.error")),
      role: Yup.string().required(t("auth.role") + " " + t("common.error")),
      preferredLanguage: Yup.string().required(t("labour.preferredLanguage") + " " + t("common.error")),
    }),
    onSubmit: (values) => {
      const { confirmPassword, ...userData } = {
        ...values,
        profileImageBase64: profileImage,
      }
      register(userData)
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {t("auth.register")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              label={t("auth.name")}
              name="name"
              autoComplete="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="mobileNumber"
              label={t("auth.mobileNumber")}
              name="mobileNumber"
              autoComplete="tel"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              label={t("auth.email")}
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="password"
              label={t("auth.password")}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="confirmPassword"
              label={t("auth.confirmPassword")}
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
              <InputLabel id="role-label">{t("auth.role")}</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                label={t("auth.role")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="admin">{t("auth.admin")}</MenuItem>
                <MenuItem value="teamLead">{t("auth.teamLead")}</MenuItem>
              </Select>
              {formik.touched.role && formik.errors.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              label={t("auth.address")}
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="village"
              label={t("auth.village")}
              name="village"
              value={formik.values.village}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.village && Boolean(formik.errors.village)}
              helperText={formik.touched.village && formik.errors.village}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}>
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
          <Grid item xs={12}>
            <Button component="label" variant="outlined" startIcon={<CloudUpload />} sx={{ mt: 1 }} fullWidth>
              {profileImage ? t("labour.uploadImage") + " ✓" : t("labour.uploadImage")}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Grid>
        </Grid>
        <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {t("auth.register")}
        </LoadingButton>
        <Box sx={{ textAlign: "center" }}>
          <Button component={Link} to="/login" variant="text" size="small">
            {t("auth.login")}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default Register

