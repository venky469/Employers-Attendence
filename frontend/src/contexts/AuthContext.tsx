// // "use client"

// // import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// // import { useNavigate } from "react-router-dom"
// // import { api } from "../utils/api"
// // import { toast } from "react-toastify"

// // interface User {
// //   id: string
// //   name: string
// //   email?: string
// //   mobileNumber: string
// //   role: string
// //   isApproved: boolean
// //   preferredLanguage: string
// //   profileImage?: string
// // }

// // interface AuthContextType {
// //   user: User | null
// //   clearError: any
// //   error: any
// //   isAuthenticated: boolean
// //   loading: boolean
// //   login: (mobileNumber: string, password: string) => Promise<void>
// //   register: (userData: any) => Promise<void>
// //   logout: () => void
// //   checkAuth: () => Promise<void>
// //   updateUser: (userData: Partial<User>) => Promise<void>
// //   resetPassword: (mobileNumber: string) => Promise<void>
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null)
// //   const [isAuthenticated, setIsAuthenticated] = useState(false)
// //   const [loading, setLoading] = useState(true)
// //   const navigate = useNavigate()

// //   // Check if user is authenticated
// //   const checkAuth = async () => {
// //     const token = localStorage.getItem("token")
// //     if (!token) {
// //       setLoading(false)
// //       return
// //     }

// //     try {
// //       setLoading(true)
// //       const response = await api.get("/auth/me")
// //       setUser(response.data.data)
// //       setIsAuthenticated(true)

// //       // Redirect to appropriate dashboard based on role
// //       if (response.data.data.role === "admin") {
// //         navigate("/admin")
// //       } else if (response.data.data.role === "teamLead") {
// //         if (response.data.data.isApproved) {
// //           navigate("/team-lead")
// //         } else {
// //           navigate("/pending-approval")
// //         }
// //       }
// //     } catch (error) {
// //       localStorage.removeItem("token")
// //       toast.error("Authentication failed. Please login again.")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Login user
// //   const login = async (mobileNumber: string, password: string) => {
// //     setLoading(true)
// //     try {
// //       const response = await api.post("/auth/login", { mobileNumber, password })
// //       localStorage.setItem("token", response.data.token)
// //       setUser(response.data.user)
// //       setIsAuthenticated(true)

// //       toast.success("Login successful!")

// //       // Redirect based on role
// //       if (response.data.user.role === "admin") {
// //         navigate("/admin")
// //       } else if (response.data.user.role === "teamLead") {
// //         if (response.data.user.isApproved) {
// //           navigate("/team-lead")
// //         } else {
// //           navigate("/pending-approval")
// //         }
// //       }
// //     } catch (error) {
// //       // Error is handled by the API interceptor
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Register user
// //   const register = async (userData: any) => {
// //     setLoading(true)
// //     try {
// //       const response = await api.post("/auth/register", userData)
// //       localStorage.setItem("token", response.data.token)
// //       setUser(response.data.user)
// //       setIsAuthenticated(true)

// //       toast.success("Registration successful!")

// //       // Redirect based on role
// //       if (response.data.user.role === "admin") {
// //         navigate("/admin")
// //       } else if (response.data.user.role === "teamLead") {
// //         if (response.data.user.isApproved) {
// //           navigate("/team-lead")
// //         } else {
// //           navigate("/pending-approval")
// //         }
// //       }
// //     } catch (error) {
// //       // Error is handled by the API interceptor
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Logout user
// //   const logout = () => {
// //     localStorage.removeItem("token")
// //     setUser(null)
// //     setIsAuthenticated(false)
// //     navigate("/login")
// //     toast.info("You have been logged out")
// //   }

// //   // Update user
// //   const updateUser = async (userData: Partial<User>) => {
// //     setLoading(true)
// //     try {
// //       const response = await api.put("/auth/updatedetails", userData)
// //       setUser(response.data.data)
// //       toast.success("Profile updated successfully")
// //       return response.data.data
// //     } catch (error) {
// //       // Error is handled by the API interceptor
// //       throw error
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Reset password
// //   const resetPassword = async (mobileNumber: string) => {
// //     setLoading(true)
// //     try {
// //       await api.post("/auth/forgotpassword", { mobileNumber })
// //       toast.success("Password reset instructions sent to your mobile number")
// //     } catch (error) {
// //       // Error is handled by the API interceptor
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     checkAuth()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [])

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         isAuthenticated,
// //         loading,
// //         login,
// //         register,
// //         logout,
// //         checkAuth,
// //         updateUser,
// //         resetPassword,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   )
// // }

// // export const useAuth = () => {
// //   const context = useContext(AuthContext)
// //   if (context === undefined) {
// //     throw new Error("useAuth must be used within an AuthProvider")
// //   }
// //   return context
// // }



// // import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// // import { useNavigate } from "react-router-dom"
// // import { api } from "../utils/api"
// // import { toast } from "react-toastify"

// // interface User {
// //   id: string
// //   name: string
// //   email?: string
// //   mobileNumber: string
// //   address?: string        
// //   village?: string 
// //   role: string
// //   isApproved: boolean
// //   preferredLanguage: string
// //   profileImage?: string
// // }

// // interface AuthContextType {
// //   user: User | null
// //   error: any
// //   clearError: () => void
// //   isAuthenticated: boolean
// //   loading: boolean
// //   login: (mobileNumber: string, password: string) => Promise<void>
// //   register: (userData: any) => Promise<void>
// //   logout: () => void
// //   checkAuth: () => Promise<void>
// //   updateUser: (userData: Partial<User>) => Promise<void>
// //   resetPassword: (mobileNumber: string) => Promise<void>
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null)
// //   const [isAuthenticated, setIsAuthenticated] = useState(false)
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState<any>(null)
// //   const navigate = useNavigate()

// //   const clearError = () => setError(null)

// //   const checkAuth = async () => {
// //     const token = localStorage.getItem("token")
// //     if (!token) {
// //       setLoading(false)
// //       return
// //     }

// //     try {
// //       setLoading(true)
// //       const response = await api.get("/auth/me")
// //       setUser(response.data.data)
// //       setIsAuthenticated(true)

// //       if (response.data.data.role === "admin") {
// //         navigate("/admin")
// //       } else if (response.data.data.role === "teamLead") {
// //         if (response.data.data.isApproved) {
// //           navigate("/team-lead")
// //         } else {
// //           navigate("/pending-approval")
// //         }
// //       }
// //     } catch (err) {
// //       localStorage.removeItem("token")
// //       setError(err)
// //       toast.error("Authentication failed. Please login again.")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const login = async (mobileNumber: string, password: string) => {
// //     setLoading(true);
  
// //     try {
// //       const response = await api.post("/auth/login", { mobileNumber, password });
  
// //       // On successful login
// //       localStorage.setItem("token", response.data.token);
// //       setUser(response.data.user);
// //       setIsAuthenticated(true);
  
// //       toast.success("Login successful!");
  
// //       // Role-based navigation
// //       if (response.data.user.role === "admin") {
// //         navigate("/admin");
// //       } else if (response.data.user.role === "teamLead") {
// //         if (response.data.user.isApproved) {
// //           navigate("/team-lead");
// //         } else {
// //           navigate("/pending-approval");
// //         }
// //       }
// //     } catch (err: any) {
// //       // Check if the error response contains a message
// //       let errorMessage = "An unexpected error occurred. Please try again.";
// //       if (err.response && err.response.data && err.response.data.message) {
// //         errorMessage = err.response.data.message; // Use the error message from the API
// //       }
      
// //       setError(errorMessage); // Set the error message
// //       toast.error(errorMessage); // Show error toast
  
// //       // Clear the error after 10 seconds
// //       setTimeout(() => {
// //         setError(""); // Clear the error message
// //       }, 10000); // 10 seconds
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  

// //   const register = async (userData: any) => {
// //     setLoading(true)
// //     clearError()
// //     try {
// //       const response = await api.post("/auth/register", userData)
// //       localStorage.setItem("token", response.data.token)
// //       setUser(response.data.user)
// //       setIsAuthenticated(true)

// //       toast.success("Registration successful!")

// //       if (response.data.user.role === "admin") {
// //         navigate("/admin")
// //       } else if (response.data.user.role === "teamLead") {
// //         if (response.data.user.isApproved) {
// //           navigate("/team-lead")
// //         } else {
// //           navigate("/pending-approval")
// //         }
// //       }
// //     } catch (err) {
// //       setError(err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const logout = () => {
// //     localStorage.removeItem("token")
// //     setUser(null)
// //     setIsAuthenticated(false)
// //     toast.info("You have been logged out")
// //     navigate("/login")
// //   }

// //   const updateUser = async (userData: Partial<User>) => {
// //     setLoading(true)
// //     clearError()
// //     try {
// //       const response = await api.put("/auth/updatedetails", userData)
// //       setUser(response.data.data)
// //       toast.success("Profile updated successfully")
// //       return response.data.data
// //     } catch (err) {
// //       setError(err)
// //       throw err
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const resetPassword = async (mobileNumber: string) => {
// //     setLoading(true)
// //     clearError()
// //     try {
// //       await api.post("/auth/forgotpassword", { mobileNumber })
// //       toast.success("Password reset instructions sent to your mobile number")
// //     } catch (err) {
// //       setError(err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     checkAuth()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [])

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         error,
// //         clearError,
// //         isAuthenticated,
// //         loading,
// //         login,
// //         register,
// //         logout,
// //         checkAuth,
// //         updateUser,
// //         resetPassword,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   )
// // }

// // export const useAuth = () => {
// //   const context = useContext(AuthContext)
// //   if (context === undefined) {
// //     throw new Error("useAuth must be used within an AuthProvider")
// //   }
// //   return context
// // }



// import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../utils/api";
// import { toast } from "react-toastify";


// interface User {
//   id: string;
//   name: string;
//   email?: string;
//   mobileNumber: string;
//   address?: string;
//   village?: string;
//   role: string;
//   isApproved: boolean;
//   preferredLanguage: string;
//   profileImage?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   error: string | null; // Updated to string | null
//   clearError: () => void;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (mobileNumber: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   checkAuth: () => Promise<void>;
//   updateUser: (userData: Partial<User>) => Promise<void>;
//   resetPassword: (mobileNumber: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null); // Updated to string | null
//   const navigate = useNavigate();

//   const clearError = () => setError(null);

//   const checkAuth = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await api.get("/auth/me");
//       setUser(response.data.data);
//       setIsAuthenticated(true);

//       if (response.data.data.role === "admin") {
//         navigate("/admin");
//       } else if (response.data.data.role === "teamLead") {
//         if (response.data.data.isApproved) {
//           navigate("/team-lead");
//         } else {
//           navigate("/pending-approval");
//         }
//       }
//     } catch (err: any) {
//       localStorage.removeItem("token");
//       const errorMessage = err.response?.data?.message || "Authentication failed. Please login again.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   let errorTimeout: NodeJS.Timeout | null = null; // Store timeout reference

//   const login = async (mobileNumber: string, password: string) => {
//     setLoading(true);
//     try {
//       const response = await api.post("/auth/login", { mobileNumber, password });

//       localStorage.setItem("token", response.data.token);
//       setUser(response.data.user);
//       setIsAuthenticated(true);

//       toast.success("Login successful!");

//       if (response.data.user.role === "admin") {
//         navigate("/admin");
//       } else if (response.data.user.role === "teamLead") {
//         if (response.data.user.isApproved) {
//           navigate("/team-lead");
//         } else {
//           navigate("/pending-approval");
//         }
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage);

//       // Clear previous timeout
//       if (errorTimeout) clearTimeout(errorTimeout);
//       // Set new timeout
//       errorTimeout = setTimeout(() => {
//         setError(null);
//         errorTimeout = null;
//       }, 10000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setLoading(true);
//     try {
//       const response = await api.post("/auth/register", userData);
//       localStorage.setItem("token", response.data.token);
//       setUser(response.data.user);
//       setIsAuthenticated(true);

//       toast.success("Registration successful!");

//       if (response.data.user.role === "admin") {
//         navigate("/admin");
//       } else if (response.data.user.role === "teamLead") {
//         if (response.data.user.isApproved) {
//           navigate("/team-lead");
//         } else {
//           navigate("/pending-approval");
//         }
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setIsAuthenticated(false);
//     toast.info("You have been logged out");
//     navigate("/login");
//   };

//   const updateUser = async (userData: Partial<User>) => {
//     setLoading(true);
//     try {
//       const response = await api.put("/auth/updatedetails", userData);
//       setUser(response.data.data);
//       toast.success("Profile updated successfully");
//       return response.data.data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (mobileNumber: string) => {
//     setLoading(true);
//     try {
//       await api.post("/auth/forgotpassword", { mobileNumber });
//       toast.success("Password reset instructions sent to your mobile number");
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to send password reset instructions.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         error,
//         clearError,
//         isAuthenticated,
//         loading,
//         login,
//         register,
//         logout,
//         checkAuth,
//         updateUser,
//         resetPassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };




import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  address?: string;
  village?: string;
  role: string;
  isApproved: boolean;
  preferredLanguage: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  login: (mobileNumber: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetPassword: (mobileNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data.data);
      setIsAuthenticated(true);

      console.log("checkAuth - Navigating to role-based route:", response.data.data.role);
      if (response.data.data.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (response.data.data.role === "teamLead") {
        if (response.data.data.isApproved) {
          navigate("/team-lead", { replace: true });
        } else {
          navigate("/pending-approval", { replace: true });
        }
      }
    } catch (err: any) {
      localStorage.removeItem("token");
      const errorMessage = err.response?.data?.message || "Authentication failed. Please login again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobileNumber: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { mobileNumber, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);

      toast.success("Login successful!");

      
      if (response.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (response.data.user.role === "teamLead") {
        if (response.data.user.isApproved) {
          navigate("/team-lead", { replace: true });
        } else {
          navigate("/pending-approval", { replace: true });
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);

      toast.success("Registration successful!");

      if (response.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (response.data.user.role === "teamLead") {
        if (response.data.user.isApproved) {
          navigate("/team-lead", { replace: true });
        } else {
          navigate("/pending-approval", { replace: true });
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out");
    navigate("/login", { replace: true });
  };

  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const response = await api.put("/auth/updatedetails", userData);
      setUser(response.data.data);
      toast.success("Profile updated successfully");
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (mobileNumber: string) => {
    setLoading(true);
    try {
      await api.post("/auth/forgotpassword", { mobileNumber });
      toast.success("Password reset instructions sent to your mobile number");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send password reset instructions.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        clearError,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};