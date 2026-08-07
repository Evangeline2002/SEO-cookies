import { useState, useEffect } from 'react';
import { HiOutlineStar, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getReviews, updateReviewStatus, deleteReview } from '../../services/adminService';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    getReviews().then(({ data }) => setReviews(data)).catch(() => toast.error('Failed to load reviews')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview(id); toast.success('Review deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleApprove = async (id) => {
    try { await updateReviewStatus(id, 'Approved'); toast.success('Review approved'); fetch(); }
    catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Reviews</h1>
        <p className="text-gray-400 mt-1">Manage customer reviews and ratings</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{review.customer_name}</span>
                  <span className="text-sm text-gray-400">on</span>
                  <span className="text-sm font-medium text-[#8B4513]">{review.product_name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {review.status === 'Pending' && (
                  <button onClick={() => handleApprove(review.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Approve</button>
                )}
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${review.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{review.status}</span>
                <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <div className="text-center py-12 text-gray-400">No reviews yet</div>}
      </div>
    </div>
  );
}
