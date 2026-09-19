import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import History from "./pages/History";

export default function App() {
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/predict" element={<Prediction />} /><Route path="/history" element={<History />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
