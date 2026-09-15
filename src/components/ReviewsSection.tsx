import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CLINIC_INFO, CLINIC_REVIEWS } from '../data/clinicData';
import { ClinicReview } from '../types';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink, 
  Send, 
  ThumbsUp, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ClinicReview[]>(CLINIC_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const filterOptions = [
    'All',
    'Sciatica & Disc',
    'Frozen Shoulder',
    'ACL Sports Rehab',
    'Cervical Neck',
    'Knee Arthritis'
  ];

  const filteredReviews = reviews.filter(rev => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Sciatica & Disc') return rev.conditionTreated.toLowerCase().includes('disc') || rev.conditionTreated.toLowerCase().includes('sciatica');
    if (selectedFilter === 'Frozen Shoulder') return rev.conditionTreated.toLowerCase().includes('shoulder');
    if (selectedFilter === 'ACL Sports Rehab') return rev.conditionTreated.toLowerCase().includes('acl');
    if (selectedFilter === 'Cervical Neck') return rev.conditionTreated.toLowerCase().includes('cervical') || rev.conditionTreated.toLowerCase().includes('neck');
    if (selectedFilter === 'Knee Arthritis') return rev.conditionTreated.toLowerCase().includes('knee');
    return true;
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newAuthor,
          rating: newRating,
          conditionTreated: newCondition || 'Physiotherapy Patient',
          comment: newComment
        })
      });
      const data = await response.json();
      if (data && data.review) {
        setReviews([data.review, ...reviews]);
        setSubmissionSuccess(true);

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          setShowReviewModal(false);
          setSubmissionSuccess(false);
          setNewAuthor('');
          setNewCondition('');
          setNewComment('');
        }, 1800);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-900/60 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Overall Google Rating */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              Verified Patient Testimonials
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Rated <span className="text-amber-400">5.0 Out of 5.0</span> Across 251 Google Reviews
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Read real patient recoveries from Dasarahalli, Jnana Ganga Nagar, and across Bengaluru 
              who regained pain-free mobility at Jayanti Physiotherapy Clinic.
            </p>
          </div>

          {/* Rating Summary Card & Write Review Trigger */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="text-3xl font-black text-white font-display">5.0</div>
              <div className="flex items-center gap-0.5 justify-center my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">251 Reviews</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write a Patient Review</span>
              </button>

              <a
                href={CLINIC_INFO.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View on Google Reviews</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Condition Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {review.author}
                      {review.verifiedPatient && (
                        <span title="Verified Patient">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">{review.timeAgo}</span>
                  </div>

                  <div className="flex items-center gap-0.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Condition Tag */}
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-teal-950/70 border border-teal-500/30 text-teal-300 text-[11px] font-medium">
                  {review.conditionTreated}
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Verified badge footer */}
              <div className="pt-3 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Clinical Consultation</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal Form */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  Share Your Recovery Story
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-semibold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {submissionSuccess ? (
                <div className="p-6 text-center space-y-2">
                  <Sparkles className="w-10 h-10 text-teal-400 mx-auto animate-bounce" />
                  <div className="text-base font-bold text-white">Review Submitted!</div>
                  <p className="text-xs text-slate-300">
                    Thank you for helping other patients discover Jayanti Physiotherapy Clinic.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Condition or Body Region Treated:
                    </label>
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="e.g. Cervical Spondylosis or Knee Pain"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Rating:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {newRating}.0 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your Treatment Experience:
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Describe how the physical therapy, modalities, and exercises helped relieve your pain..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
