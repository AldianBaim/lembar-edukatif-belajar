import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";

// Import popper js
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./assets/style/index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Learn from "./learn/Learn.jsx";
import Detail from "./learn/[slug].jsx";
import NotFound from "./NotFound.jsx";
import PreScan from "./PreScan.jsx";
import Quiz from "./quiz/Quiz.jsx";
import AddQuestion from "./quiz/AddQuestion.jsx";
import Login from "./auth/Login.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import QuizzesModule from "./admin/quiz/index.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import UsersModule from "./admin/users/index.jsx";
import LessonsModule from "./admin/lessons/index.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ChangeProfile from "./auth/ChangeProfile.jsx";

const LoadingScreen = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Memuat aplikasi...</p>
  </div>
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Routes>
          {/* Rute login yang tidak dilindungi */}
          <Route path="/login" element={<Login />} />
          <Route path="/change-profile" element={<ChangeProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/dashboard/users" element={<UsersModule />} />
          {/* Semua rute lainnya dilindungi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/prescan" element={<PreScan />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/add" element={<AddQuestion />} />
            <Route path="/learn/:slug" element={<Detail />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/dashboard/quizzes"
              element={<QuizzesModule />}
            />
            <Route path="/admin/dashboard/users" element={<UsersModule />} />
            <Route
              path="/admin/dashboard/lessons"
              element={<LessonsModule />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  // </StrictMode>
);
