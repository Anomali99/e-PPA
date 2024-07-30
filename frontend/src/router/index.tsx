import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  LoginPage,
  DashboardPage,
  DataPage,
  PaymentPage,
  SearchPage,
  UploadPage,
} from "../pages";
import { AuthProvider, ProtectedRoute } from "./middleware";

const Router: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute thisLogin={true}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school"
          element={
            <ProtectedRoute>
              <DataPage content={3} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/putri"
          element={
            <ProtectedRoute>
              <DataPage content={2} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/putra"
          element={
            <ProtectedRoute>
              <DataPage content={1} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default Router;
