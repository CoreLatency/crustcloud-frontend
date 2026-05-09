import { useCallback, useEffect, useRef, useState } from "react";
import { productionApi } from "../api/productionApi";
import type {
	Alert,
	GanttProduct,
	OutputProduct,
	ProductionLine,
	ProductionRow,
	ProductionStats,
	ProfileResponse,
	Recipe,
	Schedule,
} from "../api/types";

interface UseApiResult<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

function useApiCall<T>(apiCall: () => Promise<T>): UseApiResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const apiCallRef = useRef(apiCall);
	apiCallRef.current = apiCall;

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await apiCallRef.current();
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}

export function useProductionStats(): UseApiResult<ProductionStats> {
	return useApiCall(() => productionApi.getStats());
}

export function useGanttData(): UseApiResult<GanttProduct[]> {
	return useApiCall(() => productionApi.getGanttData());
}

export function useOutputData(): UseApiResult<OutputProduct[]> {
	return useApiCall(() => productionApi.getOutputData());
}

export function useTableData(): UseApiResult<ProductionRow[]> {
	return useApiCall(() => productionApi.getTableData());
}

export function useProductionLines(): UseApiResult<ProductionLine[]> {
	return useApiCall(() => productionApi.getProductionLines());
}

export function useRecipes(
	category?: string,
	search?: string,
): UseApiResult<Recipe[]> {
	const [data, setData] = useState<Recipe[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await productionApi.getRecipes(category, search);
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, [category, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}

export function useSchedules(): UseApiResult<Schedule[]> {
	return useApiCall(() => productionApi.getSchedules());
}

export function useAlerts(): UseApiResult<Alert[]> {
	return useApiCall(() => productionApi.getAlerts());
}

export function useProfile(): UseApiResult<ProfileResponse> {
	return useApiCall(() => productionApi.getProfile());
}
