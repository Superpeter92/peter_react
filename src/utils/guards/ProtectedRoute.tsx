import { PropsWithChildren, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export function ProtectedRoute(props: PropsWithChildren) {
  const { user } = useAuth((state) => state);
  if (user) {
    return props.children as ReactElement;
  }

  if (!user) {
    return <Navigate to="/" />;
  }
}
