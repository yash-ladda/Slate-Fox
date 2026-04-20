import supabase from "../utils/supabaseClient.js";

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const token = authHeader?.split(" ")?.[1];

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { data: dbUser, error: dbError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

        if (dbError || !dbUser) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = dbUser;

        next();

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};