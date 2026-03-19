import supabase from "../utils/supabaseClient.js";


export const createJob = async (req, res) => {
    try {

        const user = req.user;

        if(!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if(user.role !== "recruiter") {
            return res.status(403).json({message: "Only recruiters can post jobs"});
        }

        const {title, description, location, salary, scheduled_at, ends_at} = req.body;
        
        if(!title || !location || !salary || !scheduled_at || !ends_at) {
            return res.status(400).json({message: "Title, Location, Salary, Start time and End time are required"});
        }

        if (new Date(ends_at) < new Date(scheduled_at)) {
            return res.status(400).json({
                message: "End time must be after Start time",
            });
        }

        const {data, error} = await supabase.from("jobs").insert([
            {
                recruiter_id: user.id,
                title,
                description,
                location,
                salary,
                scheduled_at,
                ends_at,
                status: "open"
            }
        ])
        .select()
        .single();

        if(error) {
            return res.status(400).json({message: error.message});
        }

        return res.status(201).json({
            message: "Job posted successfully",
            job: data
        });
    }
    catch (err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .in("status", ["open", "in_progress"])
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({
                message: "No jobs found",
                jobs: [],
            });
        }

        return res.status(200).json({
            jobs: data,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getJobById = async (req, res) => {
    try {

        const {jobId} = req.params;

        const {data, error} = await supabase
            .from("jobs")
            .select("*, recruiter:users!jobs_recruiter_id_fkey(*)")
            .eq("id", jobId)
            .single();
        
        if(error) {
            return res.status(400).json({message: error.message});
        }

        if(!data) {
            return res.status(404).json({message: "Job not found"});
        }

        return res.status(200).json({job: data});
    }
    catch (err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const cancelJob = async (req, res) => {
    try {
        
        const user = req.user;
        const {jobId} = req.params;

        if(!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {data, error} = await supabase
            .from("jobs")
            .select("*")
            .eq("id", jobId)
            .single();
        
        if(error) {
            return res.status(400).json({message: error.message});
        }

        if(!data) {
            return res.status(404).json({message: "Job not found"});
        }

        if(data.recruiter_id !== user.id) {
            return res.status(403).json({message: "You are not allowed to cancel this job"});
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
    }
    catch (err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const updateJob = async (req, res) => {
    try {
        const { title, description, location, salary, scheduled_at, ends_at } = req.body;
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
            return res.status(400).json({ message: "Cannot edit cancelled job" });
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

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update",
            });
        }

        if (updates.scheduled_at && updates.ends_at) {
            if (new Date(updates.ends_at) < new Date(updates.scheduled_at)) {
                return res.status(400).json({
                    message: "End time must be after start time",
                });
            }
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