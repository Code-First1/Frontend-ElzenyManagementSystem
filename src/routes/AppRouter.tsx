import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Shop from "../pages/Shop";
import Selling from "../pages/Selling";
import Reports from "../pages/Reports";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  {
    path: "/adminDashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <Inventory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shop",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <Shop />
      </ProtectedRoute>
    ),
  },
  {
    path: "/selling",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <Selling />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <Reports />
      </ProtectedRoute>
    ),
  },
]);

function AppRouter() {
  return (
    <>
      <div dir="rtl">
        <RouterProvider router={router} />

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "16px",
              fontWeight: "600",
              maxWidth: "500px",
              padding: "16px 24px",
              borderRadius: "8px",
              backgroundColor: "#f2faf6",
              color: "#f2faf6",
              border: "1px solid #e5f5ec",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
            },
            success: {
              style: {
                backgroundColor: "#f2faf6",
                color: "#0c9d61",
                border: "1px solid #c0e5d1",
              },
            },
            error: {
              style: {
                backgroundColor: "#fff5f5",
                color: "#d32f2f",
                border: "1px solid #f8d7da",
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default AppRouter;
