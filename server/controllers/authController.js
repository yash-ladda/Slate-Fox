import supabase from "../utils/supabaseClient.js";

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if(error) {
            return res.status(401).json({message: error.message});
        }

        return res.status(200).json({
            message: "Login successful",
            user: data.user,
            access_token: data.session.access_token,
        });
    }
    catch(err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

export const signup = async (req, res) => {
    try {
        const {name, email, password, phone, role, profile_image} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required",
            });
        }

        const {data, error} = await supabase.auth.signUp({email, password});

        if(error) {
            return res.status(401).json({message: error.message});
        }

        const user = data.user;

        const {error: dbError} = await supabase.from("users").insert([
            {
                id: user.id,
                name,
                email,
                phone,
                role,
                profile_image,
            }
        ]);

        if (dbError) {
            return res.status(400).json({message: dbError.message});
        }

        return res.status(201).json({
            message: "Account created successfully",
            user
        });
    }
    catch(err) {
        return res.status(500).json({message: "Internal server error"});
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