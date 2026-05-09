import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { authApi } from "../api/authApi";
import type { User } from "../api/types";

interface AuthContextType {
	isAuthenticated: boolean;
	currentUser: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userStr = localStorage.getItem("user");

		if (token && userStr) {
			try {
				setCurrentUser(JSON.parse(userStr));
			} catch {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		const response = await authApi.login(email, password);
		localStorage.setItem("token", response.token);
		localStorage.setItem("user", JSON.stringify(response.user));
		setCurrentUser(response.user);
	};

	const register = async (name: string, email: string, password: string) => {
		const response = await authApi.register(name, email, password);
		localStorage.setItem("token", response.token);
		localStorage.setItem("user", JSON.stringify(response.user));
		setCurrentUser(response.user);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setCurrentUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!currentUser,
				currentUser,
				login,
				register,
				logout,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
