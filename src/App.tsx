import { useState } from "react";
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Production from "./pages/Production";
import Recipes from "./pages/Recipes";
import Register from "./pages/Register";
import Scheduling from "./pages/Scheduling";
import Settings from "./pages/Settings";

function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

function AppLayout() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			<Sidebar
				collapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>
			<div
				className={`transition-all duration-300 ${
					sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[220px]"
				}`}
			>
				<Header />
				<main className="p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

function AppRoutes() {
	const { isAuthenticated } = useAuth();

	return (
		<Routes>
			<Route
				path="/login"
				element={
					isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
				}
			/>
			<Route
				path="/register"
				element={
					isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
				}
			/>
			<Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/production" element={<Production />} />
					<Route path="/recipes" element={<Recipes />} />
					<Route path="/scheduling" element={<Scheduling />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/help" element={<Help />} />
				</Route>
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</BrowserRouter>
	);
}
