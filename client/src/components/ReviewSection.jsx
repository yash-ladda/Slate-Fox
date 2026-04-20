import { useState, useEffect } from "react";
import api from "../services/api";

const ReviewSection = ({ jobId, revieweeId, revieweeName }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Load existing review if it exists (for the "Edit" functionality)
    useEffect(() => {
        const checkExisting = async () => {
            try {
                const res = await api.get(`/reviews/check?job_id=${jobId}&reviewee_id=${revieweeId}`);
                if (res.data.review) {
                    setRating(res.data.review.rating);
                    setComment(res.data.review.comment || "");
                }
            } catch (err) { console.error("Error checking review", err); }
        };
        checkExisting();
    }, [jobId, revieweeId]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post("/reviews", { job_id: jobId, reviewee_id: revieweeId, rating, comment });
            alert(`Review for ${revieweeName} saved!`);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save review");
        } finally { setLoading(false); }
    };

    return (
        <div style={styles.reviewBox}>
            <p style={{ margin: "0 0 10px 0" }}>Rate <strong>{revieweeName}</strong>:</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={styles.select}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleSubmit} disabled={loading} style={styles.btn}>
                    {loading ? "..." : "Save"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    reviewBox: { background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #eee", marginTop: "10px" },
    select: { padding: "5px", borderRadius: "4px" },
    input: { flex: 1, padding: "5px", borderRadius: "4px", border: "1px solid #ccc" },
    btn: { background: "#28a745", color: "white", border: "none", padding: "5px 15px", borderRadius: "4px", cursor: "pointer" }
};

export default ReviewSection;