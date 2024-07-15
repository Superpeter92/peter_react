import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export function UnprotectedRoute(props: PropsWithChildren) {
  const { user } = useAuth((state) => state);

  return <>{!user ? props.children : <Navigate to="/dashboard/home" />}</>;
}
