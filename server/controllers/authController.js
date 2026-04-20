import supabase from "../utils/supabaseClient.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ message: error.message });
        }

        const authUser = data.user;        

        const { data: dbUser, error: dbError } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();

        if (dbError || !dbUser) {
            return res.status(404).json({
                message: "User profile not found",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: dbUser,
            access_token: data.session.access_token,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, phone, role, profile_image, bio } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required",
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role, bio }
            }
        });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const user = data.user;

        if (!user) {
            return res.status(400).json({ message: "Signup failed" });
        }

        const { error: dbError } = await supabase.from("users").insert([
            {
                id: user.id,
                name,
                email,
                phone,
                role,
                profile_image,
                bio,
            },
        ]);

        if (dbError) {
            await supabase.auth.admin.deleteUser(user.id);
            return res.status(400).json({ message: dbError.message });
        }

        return res.status(201).json({
            message: "Account created successfully",
            user,
        });

    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        
        if(!req.user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {data, error} = await supabase
            .from("users")
            .select("*")
            .eq("id", req.user.id)
            .single();

        if(error) {
            return res.status(400).json({message: error.message});
        }

        req.user = data;

        return res.status(200).json({
            user: req.user
        });

    }
    catch (err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch User Info
        const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        // ✅ Calculate Average Rating
        const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("reviewee_id", userId);

        let avgRating = 0;
        if (reviews && reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        return res.status(200).json({
            user: { ...userProfile, avgRating, reviewCount: reviews.length }
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUser = req.user;

        // ✅ SECURITY: Ensure the person making the request is updating their OWN profile
        if (loggedInUser.id !== userId) {
            return res.status(403).json({
                message: "Unauthorized: You can only update your own profile"
            });
        }

        // Extract the fields we safely allow the user to update
        // ✅ Added 'bio' to the destructuring
        const { name, phone, profile_image, bio } = req.body;

        // Build the updates object dynamically (only update what was sent)
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (profile_image) updates.profile_image = profile_image;
        if (bio !== undefined) updates.bio = bio; 
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update"
            });
        }

        const { data: updatedUser, error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", userId)
            .select("id, name, email, phone, role, profile_image, bio")
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};