interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
	return <div className={`animate-shimmer rounded ${className}`} />;
}

export function CardSkeleton() {
	return (
		<div className="card p-4 flex items-center gap-4">
			<Skeleton className="w-12 h-12 rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-6 w-16" />
			</div>
		</div>
	);
}

export function ChartSkeleton() {
	return (
		<div className="card p-6">
			<Skeleton className="h-5 w-40 mb-2" />
			<Skeleton className="h-3 w-60 mb-6" />
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex items-center gap-4">
						<Skeleton className="w-24 h-4" />
						<Skeleton className="flex-1 h-8 rounded-lg" />
					</div>
				))}
			</div>
		</div>
	);
}

export function TableSkeleton() {
	return (
		<div className="card overflow-hidden">
			<div className="flex border-b border-highlight p-4 gap-2">
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="h-8 w-24 rounded-lg" />
				))}
			</div>
			<div className="p-4 space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex gap-4">
						<Skeleton className="h-6 w-20 rounded-full" />
						<Skeleton className="h-6 w-8" />
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-6 flex-1" />
					</div>
				))}
			</div>
		</div>
	);
}

export function RecipeCardSkeleton() {
	return (
		<div className="card overflow-hidden">
			<div className="p-6 border-b border-highlight">
				<div className="flex items-start justify-between mb-3">
					<Skeleton className="w-14 h-14 rounded-xl" />
					<Skeleton className="w-16 h-5 rounded-full" />
				</div>
				<Skeleton className="h-5 w-32 mb-2" />
				<Skeleton className="h-4 w-20" />
			</div>
			<div className="p-6 space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="w-16 h-5 rounded-full" />
					<Skeleton className="w-20 h-4" />
				</div>
				<div className="flex gap-1">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="w-12 h-5 rounded" />
					))}
				</div>
			</div>
		</div>
	);
}

export function ProductionLineSkeleton() {
	return (
		<div className="card p-6">
			<div className="flex items-start justify-between mb-4">
				<div>
					<Skeleton className="h-5 w-32 mb-2" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="w-20 h-6 rounded-full" />
			</div>
			<div className="mb-4">
				<div className="flex justify-between mb-1">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-10" />
				</div>
				<Skeleton className="h-3 w-full rounded-full" />
			</div>
			<div className="grid grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i}>
						<Skeleton className="h-3 w-16 mb-1" />
						<Skeleton className="h-4 w-20" />
					</div>
				))}
			</div>
		</div>
	);
}
