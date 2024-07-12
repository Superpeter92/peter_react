import { Navigate } from "react-router";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const Login = lazy(() => import("./pages/Login"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  // {
  //   path: "dashboard",
  //   element: (
  //     <Suspense fallback={}>
  //       <LoginAuth>
  //         <RootLayout />
  //       </LoginAuth>
  //     </Suspense>
  //   ),
  //   //errorElement: <ErrorPage />,
  //   children: [],
  // },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
