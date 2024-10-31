import { Navigate } from "react-router";
import { lazy } from "react";
import { RootLayout } from "./pages/Root";
import { createBrowserRouter } from "react-router-dom";
import { UnprotectedRoute } from "./utils/guards/UnprotectedRoute";
import { ProtectedRoute } from "./utils/guards/ProtectedRoute";
const RoleList = lazy(() => import("./pages/RoleList"));
const NewEditRole = lazy(() => import("./pages/NewEditRole"));

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const UsersList = lazy(() => import("./pages/UsersList"));
const User = lazy(() => import("./pages/NewEditUser"));

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
      { path: "user-new", element: <User /> },
      { path: "user-edit/:id", element: <User /> },
      { path: "roles-list", element: <RoleList /> },
      { path: "role-new", element: <NewEditRole /> },
      { path: "role-edit/:id", element: <NewEditRole /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
