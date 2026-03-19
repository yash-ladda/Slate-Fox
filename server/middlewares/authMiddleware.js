import supabase from "../utils/supabaseClient.js";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: "Not authenticated"});
        }

        const token = authHeader.split(' ')[1];
        const {data, error} = await supabase.auth.getUser(token);

        req.user = data.user;
        next();
    }
    catch(err) {
        return res.status(500).json({message: "Internal server error"});
    }
};