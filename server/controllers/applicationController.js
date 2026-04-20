import supabase from "../utils/supabaseClient.js";

export const applyToJob = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== "worker") {
            return res.status(403).json({ message: "Only workers can apply" });
        }

        const { data: job } = await supabase
            .from("jobs")
            .select("id, status, capacity, max_applications")
            .eq("id", jobId)
            .single();

        if (!job || job.status !== "open") {
            return res.status(400).json({ message: "Job not available" });
        }

        const { data: existing } = await supabase
            .from("applications")
            .select("*")
            .eq("job_id", jobId)
            .eq("worker_id", user.id)
            .maybeSingle();

        if (existing) {
            return res.status(400).json({ message: "Already applied" });
        }

        const { count: totalApplications } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", jobId);

        if (totalApplications >= job.max_applications) {
            return res.status(400).json({
                message: "Application limit reached",
            });
        }

        const { count: acceptedCount } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", jobId)
            .eq("status", "accepted");

        if (acceptedCount >= job.capacity) {
            return res.status(400).json({
                message: "Job is full",
            });
        }

        const { data, error } = await supabase
            .from("applications")
            .insert([
                {
                    job_id: jobId,
                    worker_id: user.id,
                    status: "pending",
                },
            ])
            .select();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(201).json({
            message: "Application submitted",
            application: data,
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // ✅ Efficient Bulk Fetch: Gets applications and worker reputation in ONE query
        const { data: applications, error } = await supabase
            .from("applications")
            .select(`
                *,
                worker:worker_id (
                    id, 
                    name, 
                    profile_image,
                    reviews:reviews!reviewee_id (rating) 
                )
            `)
            .eq("job_id", jobId);

        if (error) throw error;

        // ✅ REUSE LOGIC: Format the data exactly how your Profile Controller does
        const formattedApps = applications.map(app => {
            const reviews = app.worker?.reviews || [];
            const reviewCount = reviews.length;

            // Calculate Average (Same logic as profile controller)
            const avgRating = reviewCount > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
                : "0.0";

            return {
                ...app,
                worker: {
                    id: app.worker.id,
                    name: app.worker.name,
                    profile_image: app.worker.profile_image,
                    avgRating, // Now matches Profile data
                    reviewCount
                }
            };
        });

        return res.status(200).json({ applications: formattedApps });
    } catch (err) {
        console.error("Fetch Apps Error:", err.message);
        return res.status(500).json({ message: "Error fetching applicants with ratings" });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== "worker") {
            return res.status(403).json({ message: "Only workers can view this" });
        }

        const { data, error } = await supabase
            .from("applications")
            .select("*, jobs(*)")
            .eq("worker_id", user.id);

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({ applications: data });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const user = req.user;
        const { application_id } = req.params;
        const { status } = req.body;

        const allowed = ["pending", "accepted", "rejected"];

        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        if (user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can update" });
        }

        const { data: application } = await supabase
            .from("applications")
            .select("job_id")
            .eq("id", application_id)
            .single();

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const { data: job } = await supabase
            .from("jobs")
            .select("recruiter_id, capacity")
            .eq("id", application.job_id)
            .single();

        if (!job || job.recruiter_id !== user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        if (["in_progress", "completed", "cancelled"].includes(job.status)) {
            return res.status(400).json({
                message: "Cannot update applications for this job",
            });
        }

        if (status === "accepted") {
            const { count: acceptedCount } = await supabase
                .from("applications")
                .select("*", { count: "exact", head: true })
                .eq("job_id", application.job_id)
                .eq("status", "accepted");

            if (acceptedCount >= job.capacity) {
                return res.status(400).json({
                    message: "Job capacity reached",
                });
            }
        }

        const { data, error } = await supabase
            .from("applications")
            .update({ status })
            .eq("id", application_id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({
            message: "Application updated",
            application: data,
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const cancelApplication = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params; // Assuming we pass jobId in the URL

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== "worker") {
            return res.status(403).json({ message: "Only workers can cancel applications" });
        }

        // 1. Check if the application actually exists
        const { data: existingApp, error: fetchError } = await supabase
            .from("applications")
            .select("id, status")
            .eq("job_id", jobId)
            .eq("worker_id", user.id)
            .maybeSingle();

        if (fetchError) {
            return res.status(400).json({ message: fetchError.message });
        }

        if (!existingApp) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Prevent them from cancelling if they are already "accepted"
        if (existingApp.status === "accepted") {
            return res.status(400).json({ message: "Cannot cancel an accepted application. Please contact the recruiter." });
        }

        // 2. Delete the application
        const { error: deleteError } = await supabase
            .from("applications")
            .delete()
            .eq("id", existingApp.id);

        if (deleteError) {
            return res.status(400).json({ message: deleteError.message });
        }

        return res.status(200).json({
            message: "Application cancelled successfully",
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};