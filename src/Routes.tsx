import { Navigate } from "react-router";
import { Suspense, lazy } from "react";
import { RootLayout } from "./pages/Root";
import { createBrowserRouter } from "react-router-dom";
import { UnprotectedRoute } from "./utils/guards/UnprotectedRoute";
import { ProtectedRoute } from "./utils/guards/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <UnprotectedRoute>
          <Login />
        </UnprotectedRoute>
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: (
      <Suspense>
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    //errorElement: <ErrorPage />,
    children: [{ path: "home", element: <Home /> }],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
