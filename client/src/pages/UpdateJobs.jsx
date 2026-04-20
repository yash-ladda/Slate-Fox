import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const UpdateJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        scheduled_at: "",
        ends_at: "",
        capacity: "",
        max_applications: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const getDateTimeLocal = (date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    useEffect(() => {
        fetchJob();
        document.body.style.overflow = "auto";
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${jobId}`);
            const job = res.data.job;

            setFormData({
                title: job.title || "",
                description: job.description || "",
                location: job.location || "",
                salary: job.salary || "",
                scheduled_at: getDateTimeLocal(job.scheduled_at),
                ends_at: getDateTimeLocal(job.ends_at),
                capacity: job.capacity || "",
                max_applications: job.max_applications || "",
            });
        } catch (err) {
            setMessage("Failed to load job");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (Number(formData.salary) < 0) throw new Error("Salary cannot be negative");
            if (new Date(formData.ends_at) <= new Date(formData.scheduled_at)) {
                throw new Error("End time must be after start time");
            }

            const payload = {
                ...formData,
                salary: Number(formData.salary),
                capacity: Number(formData.capacity),
                max_applications: formData.max_applications ? Number(formData.max_applications) : null,
                scheduled_at: formData.scheduled_at + ":00",
                ends_at: formData.ends_at + ":00",
            };

            await api.put(`/jobs/${jobId}`, payload);
            setMessage("Job updated successfully ✅");
            setTimeout(() => navigate(`/jobs/${jobId}`), 1500);

        } catch (err) {
            setMessage(err.response?.data?.message || err.message || "Update failed");
        }
    };

    if (loading) return (
        <div style={styles.loadingWrapper}>
            <div className="loader"></div>
            <style>{`.loader{border:5px solid #EDF1D6;border-top:5px solid #609966;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;600;800&display=swap');
                
                .update-container {
                    animation: zoomInScale 0.6s cubic-bezier(0.19, 1, 0.22, 1);
                    /* SIMPLE BORDER & BORD RAD */
                    border: 8px solid #2c3828; 
                    border-radius: 40px; 
                    box-shadow: 0 30px 60px rgba(0,0,0,0.3);
                }

                @keyframes zoomInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: #609966 !important;
                    background: #FFFFFF !important;
                }

                .update-btn:hover {
                    background: #2c3828 !important;
                    transform: translateY(-2px);
                }
                `}
            </style>

            <div style={styles.container} className="update-container">
                <header style={styles.header}>
                    <h2 style={styles.title}>Modify Job</h2>
                    <p style={styles.subtext}>Update the parameters for this active job</p>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Job Title</label>
                        <input style={styles.input} name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Detailed Description</label>
                        <textarea style={styles.textarea} name="description" value={formData.description} onChange={handleChange} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Location</label>
                        <input style={styles.input} name="location" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Compensation (₹)</label>
                            <input style={styles.input} type="number" name="salary" min="0" value={formData.salary} onChange={handleChange} required />
                        </div>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Capacity</label>
                            <input style={styles.input} type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Start Time</label>
                            <input style={styles.input} type="datetime-local" name="scheduled_at" value={formData.scheduled_at} onChange={handleChange} required />
                        </div>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>End Time</label>
                            <input style={styles.input} type="datetime-local" name="ends_at" value={formData.ends_at} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Maximum Applications</label>
                        <input style={styles.input} type="number" name="max_applications" value={formData.max_applications} onChange={handleChange} />
                    </div>

                    <button type="submit" className="update-btn" style={styles.button}>
                        UPDATE
                    </button>
                </form>

                {message && (
                    <div style={{
                        ...styles.msgBox,
                        background: message.includes("success") ? "#EDF1D6" : "#FFECEC",
                        color: message.includes("success") ? "#40513B" : "#AE2E2E"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px'
    },
    container: {
        width: '100%', maxWidth: '750px', background: '#FFFFFF', padding: '60px',
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontFamily: 'Cinzel', fontSize: '2.8rem', color: '#2c3828', margin: 0, fontWeight: '900' },
    subtext: { color: '#609966', fontSize: '1.1rem', fontWeight: '600', fontFamily: 'Inter' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    label: { fontFamily: 'Cinzel', fontSize: '0.8rem', color: '#609966', fontWeight: '900', letterSpacing: '1px' },
    input: {
        padding: '16px', borderRadius: '12px', border: '3px solid #EDF1D6',
        background: '#F8FBF5', fontFamily: 'Inter', fontWeight: '700', color: '#2c3828', transition: '0.3s'
    },
    textarea: {
        padding: '16px', borderRadius: '12px', border: '3px solid #EDF1D6',
        background: '#F8FBF5', fontFamily: 'Inter', fontWeight: '700', color: '#2c3828', minHeight: '100px', transition: '0.3s'
    },
    button: {
        marginTop: '20px', padding: '20px', background: '#609966', color: 'white',
        border: 'none', borderRadius: '12px', fontWeight: '900', fontFamily: 'Cinzel',
        fontSize: '1.2rem', cursor: 'pointer', transition: '0.3s'
    },
    msgBox: { marginTop: '25px', padding: '15px', textAlign: 'center', fontWeight: '800', fontFamily: 'Inter', borderRadius: '8px' },
    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default UpdateJob;