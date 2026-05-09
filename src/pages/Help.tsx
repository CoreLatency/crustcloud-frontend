import {
	Book,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	HelpCircle,
	Mail,
	MessageCircle,
	Phone,
	Search,
} from "lucide-react";
import { useState } from "react";

interface FAQItem {
	question: string;
	answer: string;
	category: string;
}

const faqs: FAQItem[] = [
	{
		question: "How do I create a new production batch?",
		answer:
			"Navigate to the Dashboard page and click the 'Add Batch' button. Fill in the required details including product, quantity, and planned date. The batch will appear in your production schedule once saved.",
		category: "Production",
	},
	{
		question: "How do I add a new recipe to the library?",
		answer:
			"Go to the Recipes page and click the 'Add Recipe' button. Enter the recipe name, category, ingredients, preparation time, and baking time. You can also set the difficulty level and yield amount.",
		category: "Recipes",
	},
	{
		question: "How do I schedule production shifts?",
		answer:
			"Visit the Scheduling page and select a date. Click 'Add Shift' to create a new production shift. Choose the product, time slot, and number of batches. The shift will be added to your calendar.",
		category: "Scheduling",
	},
	{
		question: "How do I pause or stop a production line?",
		answer:
			"On the Production page, find the production line you want to control. Click the pause or play button next to the line status. The line status will update in real-time.",
		category: "Production",
	},
	{
		question: "How do I export production data?",
		answer:
			"On the Dashboard page, scroll down to the production table. Click the 'Export' button to download the data as a CSV file, or click 'PDF' to generate a printable report.",
		category: "Reports",
	},
	{
		question: "How do I change my password?",
		answer:
			"Go to Settings and select the 'Password' tab. Enter your current password, then enter and confirm your new password. Click 'Update Password' to save the changes.",
		category: "Account",
	},
	{
		question: "What do the different batch statuses mean?",
		answer:
			"Waiting: The batch is scheduled but not yet started. In Progress: The batch is currently being produced. Completed: The batch has finished production. The status automatically updates based on production line activity.",
		category: "Production",
	},
	{
		question: "How do I view production alerts?",
		answer:
			"Click the bell icon in the header to view recent alerts. Unread alerts are highlighted and show a count badge. You can mark alerts as read or delete them from the notification panel.",
		category: "Alerts",
	},
];

const categories = [
	"All",
	"Production",
	"Recipes",
	"Scheduling",
	"Reports",
	"Account",
	"Alerts",
];

const quickLinks = [
	{
		title: "Getting Started Guide",
		icon: Book,
		description: "Learn the basics of the production planner",
	},
	{
		title: "Video Tutorials",
		icon: ExternalLink,
		description: "Watch step-by-step video guides",
	},
	{
		title: "API Documentation",
		icon: Book,
		description: "Technical documentation for developers",
	},
	{
		title: "Release Notes",
		icon: Book,
		description: "See what's new in each version",
	},
];

export default function Help() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

	const filteredFAQs = faqs.filter((faq) => {
		const matchesSearch =
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			activeCategory === "All" || faq.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	const toggleFAQ = (index: number) => {
		setExpandedFAQ(expandedFAQ === index ? null : index);
	};

	const handleFAQKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleFAQ(index);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center py-8">
				<div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<HelpCircle size={32} className="text-accent" />
				</div>
				<h1 className="font-heading text-3xl font-semibold text-primary mb-2">
					How can we help you?
				</h1>
				<p className="text-muted max-w-md mx-auto">
					Find answers to common questions or get in touch with our support team
				</p>
			</div>

			{/* Search */}
			<div className="max-w-xl mx-auto">
				<div className="relative">
					<Search
						size={20}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
					/>
					<input
						type="text"
						placeholder="Search for help..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="input pl-12 py-4 text-lg"
					/>
				</div>
			</div>

			{/* Quick Links */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{quickLinks.map((link) => (
					<a
						key={link.title}
						href="#"
						className="card p-5 hover:shadow-md transition-shadow group"
					>
						<link.icon
							size={24}
							className="text-accent mb-3 group-hover:scale-110 transition-transform"
						/>
						<h3 className="font-semibold text-primary mb-1">{link.title}</h3>
						<p className="text-sm text-muted">{link.description}</p>
					</a>
				))}
			</div>

			{/* FAQ Section */}
			<div className="card overflow-hidden">
				<div className="p-6 border-b border-highlight">
					<h2 className="font-heading text-xl font-semibold text-primary">
						Frequently Asked Questions
					</h2>
				</div>

				{/* Category Filters */}
				<div className="p-4 border-b border-highlight overflow-x-auto">
					<div className="flex gap-2">
						{categories.map((category) => (
							<button
								type="button"
								key={category}
								onClick={() => setActiveCategory(category)}
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

				{/* FAQ List */}
				<div className="divide-y divide-highlight">
					{filteredFAQs.length === 0 ? (
						<div className="p-8 text-center">
							<HelpCircle size={48} className="mx-auto text-muted mb-4" />
							<p className="text-lg font-medium text-primary">
								No results found
							</p>
							<p className="text-muted">Try adjusting your search or filters</p>
						</div>
					) : (
						filteredFAQs.map((faq, index) => (
							<div
								key={index}
								role="button"
								tabIndex={0}
								className="cursor-pointer"
								onClick={() => toggleFAQ(index)}
								onKeyDown={(e) => handleFAQKeyDown(e, index)}
							>
								<div className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
									<div className="flex items-start gap-3 flex-1">
										<span className="px-2.5 py-1 bg-accent/10 text-accent rounded text-xs font-medium mt-0.5">
											{faq.category}
										</span>
										<h3 className="font-medium text-primary">{faq.question}</h3>
									</div>
									{expandedFAQ === index ? (
										<ChevronUp size={20} className="text-muted flex-shrink-0" />
									) : (
										<ChevronDown
											size={20}
											className="text-muted flex-shrink-0"
										/>
									)}
								</div>
								{expandedFAQ === index && (
									<div className="px-5 pb-5 pt-0">
										<div className="pl-[72px]">
											<p className="text-muted leading-relaxed">{faq.answer}</p>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>

			{/* Contact Section */}
			<div className="card p-6">
				<h2 className="font-heading text-xl font-semibold text-primary mb-6 text-center">
					Still need help?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="text-center p-6 bg-secondary/30 rounded-xl">
						<div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<Mail size={24} className="text-accent" />
						</div>
						<h3 className="font-semibold text-primary mb-2">Email Support</h3>
						<p className="text-sm text-muted mb-4">
							Get a response within 24 hours
						</p>
						<a
							href="mailto:support@crustcloud.com"
							className="text-accent hover:underline font-medium"
						>
							support@crustcloud.com
						</a>
					</div>

					<div className="text-center p-6 bg-secondary/30 rounded-xl">
						<div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<MessageCircle size={24} className="text-accent" />
						</div>
						<h3 className="font-semibold text-primary mb-2">Live Chat</h3>
						<p className="text-sm text-muted mb-4">
							Available Mon-Fri, 9am-5pm
						</p>
						<button type="button" className="btn-primary py-2 px-4 text-sm">
							Start Chat
						</button>
					</div>

					<div className="text-center p-6 bg-secondary/30 rounded-xl">
						<div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<Phone size={24} className="text-accent" />
						</div>
						<h3 className="font-semibold text-primary mb-2">Phone Support</h3>
						<p className="text-sm text-muted mb-4">For urgent inquiries only</p>
						<a
							href="tel:+1234567890"
							className="text-accent hover:underline font-medium"
						>
							+1 (234) 567-890
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
