import { Navigate } from "react-router";
import { lazy } from "react";
import { RootLayout } from "./pages/Root";
import { createBrowserRouter } from "react-router-dom";
import { UnprotectedRoute } from "./utils/guards/UnprotectedRoute";
import { ProtectedRoute } from "./utils/guards/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const UsersList = lazy(() => import("./pages/UsersList"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <UnprotectedRoute>
        <Login />
      </UnprotectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    //errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "users-list", element: <UsersList /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
