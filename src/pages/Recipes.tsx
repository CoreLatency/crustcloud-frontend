import { ChefHat, Clock, Filter, Plus, Search, Users, X } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "../api/types";
import { RecipeCardSkeleton } from "../components/LoadingSkeleton";
import { useRecipes } from "../hooks/useApi";

const categories = ["All", "Loaf", "Rolls", "Specialty", "Pastry"];

const difficultyColors: Record<string, string> = {
	Easy: "bg-green-100 text-green-800",
	Medium: "bg-yellow-100 text-yellow-800",
	Hard: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
	active: "bg-emerald-100 text-emerald-800",
	draft: "bg-gray-100 text-gray-600",
};

interface RecipeModalProps {
	recipe: Recipe | null;
	onClose: () => void;
}

function RecipeModal({ recipe, onClose }: RecipeModalProps) {
	if (!recipe) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b border-highlight">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<span className="text-5xl">{recipe.image}</span>
							<div>
								<h2 className="font-heading text-2xl font-semibold text-primary">
									{recipe.name}
								</h2>
								<span
									className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[recipe.status] || statusColors.active}`}
								>
									{recipe.status}
								</span>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-2 hover:bg-secondary rounded-full transition-colors"
						>
							<X size={20} className="text-muted" />
						</button>
					</div>
				</div>

				<div className="p-6 space-y-6">
					{/* Details */}
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center p-3 bg-secondary/50 rounded-xl">
							<Clock size={20} className="mx-auto mb-1 text-accent" />
							<p className="text-xs text-muted">Prep Time</p>
							<p className="font-semibold text-primary">{recipe.prepTime}</p>
						</div>
						<div className="text-center p-3 bg-secondary/50 rounded-xl">
							<ChefHat size={20} className="mx-auto mb-1 text-accent" />
							<p className="text-xs text-muted">Baking</p>
							<p className="font-semibold text-primary">{recipe.bakingTime}</p>
						</div>
						<div className="text-center p-3 bg-secondary/50 rounded-xl">
							<Users size={20} className="mx-auto mb-1 text-accent" />
							<p className="text-xs text-muted">Yield</p>
							<p className="font-semibold text-primary">{recipe.yieldAmount}</p>
						</div>
					</div>

					{/* Category & Difficulty */}
					<div className="flex items-center gap-3">
						<span className="px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
							{recipe.category}
						</span>
						<span
							className={`px-3 py-1.5 rounded-full text-sm font-medium ${difficultyColors[recipe.difficulty] || difficultyColors.Easy}`}
						>
							{recipe.difficulty}
						</span>
					</div>

					{/* Ingredients */}
					<div>
						<h3 className="font-heading text-lg font-semibold text-primary mb-3">
							Ingredients
						</h3>
						<div className="flex flex-wrap gap-2">
							{recipe.ingredients.map((ingredient, idx) => (
								<span
									key={idx}
									className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-primary"
								>
									{ingredient}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="p-6 border-t border-highlight">
					<button
						type="button"
						onClick={onClose}
						className="btn-primary w-full py-3"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default function Recipes() {
	const [activeCategory, setActiveCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

	const {
		data: recipes,
		loading,
		error,
		refetch,
	} = useRecipes(
		activeCategory !== "All" ? activeCategory : undefined,
		searchQuery || undefined,
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
		setSearchQuery("");
	};

	const handleRecipeClick = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
	};

	const handleRecipeKeyDown = (e: React.KeyboardEvent, recipe: Recipe) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setSelectedRecipe(recipe);
		}
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 card">
				<p className="text-red-600 mb-4">Failed to load recipes</p>
				<button type="button" onClick={refetch} className="btn-primary">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="font-heading text-2xl font-semibold text-primary">
						Recipe Library
					</h1>
					<p className="text-muted">Manage your bakery recipes and products</p>
				</div>
				<button type="button" className="btn-primary flex items-center gap-2">
					<Plus size={18} /> Add Recipe
				</button>
			</div>

			{/* Filters */}
			<div className="card p-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
						/>
						<input
							type="text"
							placeholder="Search recipes..."
							value={searchQuery}
							onChange={handleSearch}
							className="input pl-10"
						/>
					</div>

					{/* Category Filters */}
					<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
						<Filter size={18} className="text-muted flex-shrink-0" />
						{categories.map((category) => (
							<button
								type="button"
								key={category}
								onClick={() => handleCategoryChange(category)}
								className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
									activeCategory === category
										? "bg-accent text-white"
										: "bg-secondary text-primary hover:bg-highlight"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Recipe Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading ? (
					[1, 2, 3, 4, 5, 6].map((i) => <RecipeCardSkeleton key={i} />)
				) : recipes?.length === 0 ? (
					<div className="col-span-full text-center py-12">
						<ChefHat size={48} className="mx-auto text-muted mb-4" />
						<p className="text-lg font-medium text-primary">No recipes found</p>
						<p className="text-muted">Try adjusting your search or filters</p>
					</div>
				) : (
					recipes?.map((recipe, index) => (
						<div
							key={recipe.id}
							role="button"
							tabIndex={0}
							className="card overflow-hidden hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
							style={{ animationDelay: `${index * 0.05}s` }}
							onClick={() => handleRecipeClick(recipe)}
							onKeyDown={(e) => handleRecipeKeyDown(e, recipe)}
						>
							<div className="p-6 border-b border-highlight">
								<div className="flex items-start justify-between mb-3">
									<span className="text-4xl">{recipe.image}</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											statusColors[recipe.status] || statusColors.active
										}`}
									>
										{recipe.status}
									</span>
								</div>
								<h3 className="font-heading text-lg font-semibold text-primary mb-1">
									{recipe.name}
								</h3>
								<p className="text-sm text-muted">{recipe.category}</p>
							</div>

							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											difficultyColors[recipe.difficulty] ||
											difficultyColors.Easy
										}`}
									>
										{recipe.difficulty}
									</span>
									<div className="flex items-center gap-1 text-sm text-muted">
										<Clock size={14} />
										<span>{recipe.prepTime}</span>
									</div>
								</div>

								<div className="flex flex-wrap gap-1">
									{recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
										<span
											key={idx}
											className="px-2 py-0.5 bg-secondary rounded text-xs text-muted"
										>
											{ingredient}
										</span>
									))}
									{recipe.ingredients.length > 3 && (
										<span className="px-2 py-0.5 bg-secondary rounded text-xs text-muted">
											+{recipe.ingredients.length - 3}
										</span>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Recipe Modal */}
			{selectedRecipe && (
				<RecipeModal
					recipe={selectedRecipe}
					onClose={() => setSelectedRecipe(null)}
				/>
			)}
		</div>
	);
}
