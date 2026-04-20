import supabase from "../utils/supabaseClient.js";


export const createJob = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can post jobs" });
        }

        const {
            title,
            description,
            location,
            salary,
            scheduled_at,
            ends_at,
            capacity,
            max_applications,
        } = req.body;

        if (!title || !location || !salary || !scheduled_at || !ends_at || !capacity) {
            return res.status(400).json({
                message: "Title, Location, Salary, Start time, End time and Capacity are required",
            });
        }

        if (new Date(ends_at) < new Date(scheduled_at)) {
            return res.status(400).json({
                message: "End time must be after Start time",
            });
        }

        if (max_applications && max_applications < capacity) {
            return res.status(400).json({
                message: "Max applications should be >= capacity",
            });
        }

        const { data, error } = await supabase
            .from("jobs")
            .insert([
                {
                    recruiter_id: user.id,
                    title,
                    description,
                    location,
                    salary,
                    scheduled_at,
                    ends_at,
                    status: "open",
                    capacity,
                    max_applications: max_applications || capacity * 5, // 🔥 better default
                },
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(201).json({
            message: "Job posted successfully",
            job: data,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { search, location, sort } = req.query;

        let query = supabase
            .from("jobs")
            .select("*")
            .eq("status", "open"); // Only show active jobs

        // ✅ 1. Search by Title (Case-insensitive)
        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        // ✅ 2. Filter by Location
        if (location) {
            query = query.eq("location", location);
        }

        // ✅ 3. Sorting Logic
        if (sort === "salary_high") {
            query = query.order("salary", { ascending: false });
        } else if (sort === "salary_low") {
            query = query.order("salary", { ascending: true });
        } else {
            // Default: Newest first
            query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) return res.status(400).json({ message: error.message });

        return res.status(200).json({ jobs: data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        const { data, error } = await supabase
            .from("jobs")
            .select("*, recruiter:users!jobs_recruiter_id_fkey(id, name, profile_image)")
            .eq("id", jobId)
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (!data) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json({ job: data });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelJob = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .eq("id", jobId)
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (!data) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (data.recruiter_id !== user.id) {
            return res.status(403).json({
                message: "You are not allowed to cancel this job",
            });
        }

        if (data.status === "completed") {
            return res.status(400).json({
                message: "Cannot cancel a completed job",
            });
        }

        const { error: updateError } = await supabase
            .from("jobs")
            .update({ status: "cancelled" })
            .eq("id", jobId);

        if (updateError) {
            return res.status(400).json({ message: updateError.message });
        }

        return res.status(200).json({
            message: "Job cancelled successfully",
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateJob = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            salary,
            scheduled_at,
            ends_at,
            capacity,
            max_applications,
        } = req.body;

        const { jobId } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { data: job, error } = await supabase
            .from("jobs")
            .select("*")
            .eq("id", jobId)
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (["in_progress", "completed"].includes(job.status)) {
            return res.status(400).json({
                message: "Cannot edit ongoing or completed jobs",
            });
        }

        if (job.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot edit cancelled job",
            });
        }

        if (user.id !== job.recruiter_id) {
            return res.status(403).json({
                message: "You are not allowed to edit this job",
            });
        }

        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (location) updates.location = location;
        if (salary) updates.salary = salary;
        if (scheduled_at) updates.scheduled_at = scheduled_at;
        if (ends_at) updates.ends_at = ends_at;
        if (capacity) updates.capacity = capacity;
        if (max_applications) updates.max_applications = max_applications;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update",
            });
        }

        const newStart = updates.scheduled_at || job.scheduled_at;
        const newEnd = updates.ends_at || job.ends_at;

        if (new Date(newEnd) < new Date(newStart)) {
            return res.status(400).json({
                message: "End time must be after start time",
            });
        }

        const newCapacity = updates.capacity || job.capacity;
        const newMaxApps = updates.max_applications || job.max_applications;

        if (newMaxApps < newCapacity) {
            return res.status(400).json({
                message: "Max applications should be >= capacity",
            });
        }

        const { data: updatedJob, error: updateError } = await supabase
            .from("jobs")
            .update(updates)
            .eq("id", jobId)
            .select()
            .single();

        if (updateError) {
            return res.status(400).json({ message: updateError.message });
        }

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyPostedJobs = async (req, res) => {
    try {
        const user = req.user;

        // Safety check: Ensure they are actually a recruiter
        if (!user || user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can view their posted jobs" });
        }

        const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .eq("recruiter_id", user.id)
            .order("created_at", { ascending: false }); // Newest jobs first

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({
            jobs: data || [],
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        const stats = {};

        if (user.role === 'worker') {
            // Count my applications
            const { count: totalApps } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('worker_id', user.id);

            // Count my accepted jobs
            const { count: acceptedApps } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('worker_id', user.id)
                .eq('status', 'accepted');

            stats.totalApplications = totalApps || 0;
            stats.acceptedApplications = acceptedApps || 0;
        }

        else if (user.role === 'recruiter') {
            // Count my posted jobs
            const { count: totalJobs } = await supabase
                .from('jobs')
                .select('*', { count: 'exact', head: true })
                .eq('recruiter_id', user.id);

            // Count pending applications across all my jobs
            const { data: myJobs } = await supabase
                .from('jobs')
                .select('id')
                .eq('recruiter_id', user.id);

            const jobIds = myJobs.map(j => j.id);

            const { count: pendingApps } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .in('job_id', jobIds)
                .eq('status', 'pending');

            stats.totalPostedJobs = totalJobs || 0;
            stats.pendingReview = pendingApps || 0;
        }

        return res.status(200).json(stats);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching stats" });
    }
};