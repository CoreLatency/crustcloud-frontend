import type {
	Alert,
	GanttProduct,
	OutputProduct,
	PasswordUpdateRequest,
	ProductionLine,
	ProductionRow,
	ProductionStats,
	ProfileResponse,
	ProfileUpdateRequest,
	Recipe,
	Schedule,
} from "./types";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		headers: getAuthHeaders(),
		...options,
	});

	if (response.status === 401) {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
		throw new Error("Unauthorized");
	}

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}

export const productionApi = {
	// Dashboard
	async getStats(): Promise<ProductionStats> {
		return fetchApi<ProductionStats>("/dashboard/stats");
	},

	async getGanttData(): Promise<GanttProduct[]> {
		return fetchApi<GanttProduct[]>("/dashboard/gantt");
	},

	async getOutputData(): Promise<OutputProduct[]> {
		return fetchApi<OutputProduct[]>("/dashboard/output");
	},

	async getTableData(): Promise<ProductionRow[]> {
		return fetchApi<ProductionRow[]>("/dashboard/table");
	},

	// Production Lines
	async getProductionLines(): Promise<ProductionLine[]> {
		return fetchApi<ProductionLine[]>("/production/lines");
	},

	async updateLineStatus(id: number, status: string): Promise<ProductionLine> {
		return fetchApi<ProductionLine>(`/production/lines/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		});
	},

	async updateLineProgress(
		id: number,
		progress: number,
	): Promise<ProductionLine> {
		return fetchApi<ProductionLine>(`/production/lines/${id}/progress`, {
			method: "PATCH",
			body: JSON.stringify({ progress }),
		});
	},

	// Recipes
	async getRecipes(category?: string, search?: string): Promise<Recipe[]> {
		const params = new URLSearchParams();
		if (category && category !== "All") params.append("category", category);
		if (search) params.append("search", search);
		const query = params.toString();
		return fetchApi<Recipe[]>(`/recipes${query ? `?${query}` : ""}`);
	},

	async getRecipeById(id: number): Promise<Recipe> {
		return fetchApi<Recipe>(`/recipes/${id}`);
	},

	async createRecipe(recipe: Omit<Recipe, "id">): Promise<Recipe> {
		return fetchApi<Recipe>("/recipes", {
			method: "POST",
			body: JSON.stringify(recipe),
		});
	},

	async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
		return fetchApi<Recipe>(`/recipes/${id}`, {
			method: "PUT",
			body: JSON.stringify(recipe),
		});
	},

	async deleteRecipe(id: number): Promise<void> {
		return fetchApi<void>(`/recipes/${id}`, { method: "DELETE" });
	},

	// Schedules
	async getSchedules(): Promise<Schedule[]> {
		return fetchApi<Schedule[]>("/schedules");
	},

	async createSchedule(date: string): Promise<Schedule> {
		return fetchApi<Schedule>("/schedules", {
			method: "POST",
			body: JSON.stringify({ date }),
		});
	},

	async findOrCreateSchedule(date: string): Promise<Schedule> {
     return fetchApi<Schedule>(`/schedules/find-or-create?date=${date}`, {
         method: "POST",
     });
	},

	async addShift(
		scheduleId: number,
		productId: number,
		timeSlot: string,
		batches: number,
	): Promise<Schedule> {
		return fetchApi<Schedule>(`/schedules/${scheduleId}/shifts`, {
			method: "POST",
			body: JSON.stringify({ productId, timeSlot, batches }),
		});
	},

	async deleteShift(scheduleId: number, shiftId: number): Promise<void> {
		return fetchApi<void>(`/schedules/${scheduleId}/shifts/${shiftId}`, {
			method: "DELETE",
		});
	},

	// Alerts
	async getAlerts(): Promise<Alert[]> {
		return fetchApi<Alert[]>("/alerts");
	},

	async markAlertRead(id: number): Promise<Alert> {
		return fetchApi<Alert>(`/alerts/${id}/read`, { method: "PATCH" });
	},

	async deleteAlert(id: number): Promise<void> {
		return fetchApi<void>(`/alerts/${id}`, { method: "DELETE" });
	},

	// Settings
	async getProfile(): Promise<ProfileResponse> {
		return fetchApi<ProfileResponse>("/settings/profile");
	},

	async updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
		return fetchApi<ProfileResponse>("/settings/profile", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	async updatePassword(data: PasswordUpdateRequest): Promise<void> {
		return fetchApi<void>("/settings/password", {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},
};

export default productionApi;
