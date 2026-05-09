import {
	Calendar,
	ChefHat,
	ChevronLeft,
	ChevronRight,
	Factory,
	HelpCircle,
	LayoutDashboard,
	Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
}

const navItems = [
	{ icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
	{ icon: Calendar, label: "Scheduling", path: "/scheduling" },
	{ icon: Factory, label: "Production", path: "/production" },
	{ icon: ChefHat, label: "Recipes", path: "/recipes" },
	{ icon: Settings, label: "Settings", path: "/settings" },
	{ icon: HelpCircle, label: "Help", path: "/help" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const location = useLocation();
	const { currentUser } = useAuth();

	const isActive = (path: string) => {
		if (path === "/dashboard") {
			return location.pathname === "/" || location.pathname === "/dashboard";
		}
		return location.pathname === path;
	};

	return (
		<aside
			className={`fixed top-0 left-0 h-full bg-primary text-secondary flex-col transition-all duration-300 z-50 hidden md:flex ${
				collapsed ? "w-[70px]" : "w-[220px]"
			}`}
		>
			{/* Logo */}
			<div className="p-4 flex items-center justify-center border-b border-secondary/20">
				<img
					src="/logo.svg"
					alt="Crust & Cloud"
					className="h-14 object-contain"
				/>
			</div>

			{/* Navigation */}
			<nav className="flex-1 py-4">
				{navItems.map((item) => (
					<Link
						key={item.label}
						to={item.path}
						className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
							isActive(item.path)
								? "bg-accent text-white"
								: "text-secondary hover:bg-accent/15"
						}`}
					>
						<item.icon size={22} className="flex-shrink-0" />
						{!collapsed && (
							<span className="text-sm font-medium">{item.label}</span>
						)}
					</Link>
				))}
			</nav>

			{/* User Info */}
			{currentUser && !collapsed && (
				<div className="p-4 border-t border-secondary/20">
					<p className="text-sm font-medium text-secondary truncate">
						{currentUser.name}
					</p>
					<p className="text-xs text-muted">{currentUser.role}</p>
				</div>
			)}

			{/* Toggle Button */}
			<button
				type="button"
				onClick={onToggle}
				className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-accent rounded-full shadow-md flex items-center justify-center text-white hover:bg-accent-dark transition-colors"
			>
				{collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
			</button>
		</aside>
	);
}
