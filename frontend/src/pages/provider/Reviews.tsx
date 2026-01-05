import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import ProviderSidebar from "../../components/provider/Sidebar";
import ProviderNavbar from "../../components/provider/Navbar";
import userService, { type ReviewView } from "@/services/userService";

function renderStars(rating: number) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
				/>
			))}
		</div>
	);
}

export default function ProviderReviewsPage() {
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [reviews, setReviews] = useState<ReviewView[]>([]);
	const [loading, setLoading] = useState(false);
	const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

	const load = async (nextPage: number) => {
		setLoading(true);
		try {
			const res = await userService.getMyProviderReviews({ page: nextPage, limit: 10 });
			if (!res?.success || !res.data) {
				setReviews([]);
				setTotalPages(1);
				return;
			}

			setReviews(res.data.reviews || []);
			setTotalPages(res.data.totalPages || 1);
			setPage(res.data.page || nextPage);

			const drafts: Record<string, string> = {};
			for (const r of res.data.reviews || []) {
				drafts[r.id] = r.reply?.comment || "";
			}
			setReplyDrafts(drafts);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const canPrev = page > 1;
	const canNext = page < totalPages;

	const items = useMemo(() => reviews || [], [reviews]);

	const handleSaveReply = async (reviewId: string) => {
		const comment = (replyDrafts[reviewId] || "").trim();
		if (!comment) {
			toast.error("Reply cannot be empty");
			return;
		}

		const res = await userService.replyToReview(reviewId, { comment });
		if (!res?.success) {
			toast.error(res?.message || "Failed to send reply");
			return;
		}

		toast.success("Reply saved");
		await load(page);
	};

	return (
		<div className="flex min-h-screen">
			<ProviderSidebar />

			<div className="flex-1 flex flex-col">
				<ProviderNavbar />

				<div className="p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex-1">
					<div className="max-w-6xl mx-auto">
						<div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-md mb-6 border border-white/40">
							<h1 className="text-3xl font-bold text-indigo-700">Reviews</h1>
							<p className="text-gray-600 mt-1">Manage reviews you received and reply to customers.</p>
						</div>

						<div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-white/40 overflow-hidden">
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-xl font-semibold text-gray-800">All Reviews</h2>
									<div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
								</div>

								{loading ? (
									<div className="text-gray-600">Loading...</div>
								) : items.length === 0 ? (
									<div className="text-gray-600">No reviews yet.</div>
								) : (
									<div className="space-y-4">
										{items.map((r) => (
											<div key={r.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
												<div className="flex items-start justify-between gap-4">
													<div>
														<div className="font-semibold text-gray-800">{r.userName}</div>
														<div className="flex items-center gap-2 mt-1">
															{renderStars(r.rating)}
															<span className="text-xs text-gray-500">{r.date}</span>
														</div>
													</div>
												</div>

												{r.comment ? <p className="text-gray-700 text-sm mt-3">{r.comment}</p> : null}

												<div className="mt-4">
													<div className="text-sm font-medium text-gray-700 mb-2">Your reply</div>
													<textarea
														value={replyDrafts[r.id] ?? ""}
														onChange={(e) =>
															setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
														}
														className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
														rows={3}
														placeholder="Write a reply..."
													/>
													<div className="flex justify-end mt-2">
														<button
															onClick={() => handleSaveReply(r.id)}
															className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:opacity-90 transition font-medium"
														>
															Save Reply
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								)}

								<div className="flex items-center justify-between mt-6">
									<button
										disabled={!canPrev}
										onClick={() => load(page - 1)}
										className="px-4 py-2 rounded-xl border border-gray-300 bg-white disabled:opacity-50"
									>
										Previous
									</button>
									<button
										disabled={!canNext}
										onClick={() => load(page + 1)}
										className="px-4 py-2 rounded-xl border border-gray-300 bg-white disabled:opacity-50"
									>
										Next
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
