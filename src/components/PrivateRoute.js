import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loading />;

  return currentUser ? children : <Navigate to="/login" />;
}
