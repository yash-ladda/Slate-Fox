import supabase from "../utils/supabaseClient.js";

export const submitOrUpdateReview = async (req, res) => {
    try {
        const reviewer_id = req.user.id; // The person logged in
        const { job_id, reviewee_id, rating, comment } = req.body;

        // 1. Basic Validation
        if (!job_id || !reviewee_id || !rating) {
            return res.status(400).json({ message: "Job ID, Reviewee ID, and Rating are required" });
        }

        // 2. Verify Job Completion
        const { data: job, error: jobError } = await supabase
            .from("jobs")
            .select("status, recruiter_id")
            .eq("id", job_id)
            .single();

        if (jobError || !job) return res.status(404).json({ message: "Job not found" });

        if (job.status !== "completed") {
            return res.status(400).json({ message: "Reviews can only be submitted for completed jobs" });
        }

        // 3. Security: Check if these people were actually involved in this job
        // If the reviewer is the recruiter, the reviewee must be an accepted worker
        // If the reviewer is a worker, the reviewee must be the job's recruiter
        const { data: participation } = await supabase
            .from("applications")
            .select("id")
            .eq("job_id", job_id)
            .eq("status", "accepted")
            .or(`worker_id.eq.${reviewer_id},worker_id.eq.${reviewee_id}`)
            .single();

        if (!participation && job.recruiter_id !== reviewer_id) {
            return res.status(403).json({ message: "You were not part of this job" });
        }

        // 4. Upsert Review (Insert or Update if exists)
        // Note: Requires a UNIQUE constraint on (job_id, reviewer_id, reviewee_id) in DB
        const { data, error } = await supabase
            .from("reviews")
            .upsert({
                job_id,
                reviewer_id,
                reviewee_id,
                rating,
                comment,
            }, {
                onConflict: "job_id, reviewer_id, reviewee_id"
            })
            .select()
            .single();

        if (error) return res.status(400).json({ message: error.message });

        return res.status(200).json({
            message: "Review saved successfully",
            review: data
        });

    } catch (err) {
        console.error("Review Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch a specific review (to pre-fill the "Edit" state on frontend)
export const getMyReviewForJob = async (req, res) => {
    try {
        const { job_id, reviewee_id } = req.query;
        const reviewer_id = req.user.id;

        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("job_id", job_id)
            .eq("reviewer_id", reviewer_id)
            .eq("reviewee_id", reviewee_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error

        return res.status(200).json({ review: data || null });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching review" });
    }
};