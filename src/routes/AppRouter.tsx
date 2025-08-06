import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import { Toaster } from "react-hot-toast";
import Home from "../pages/Home";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
]);

function AppRouter() {
  return (
    <div dir="rtl">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "16px",
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
  );
}

export default AppRouter;
