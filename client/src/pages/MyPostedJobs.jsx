import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

const MyPostedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyJobs();
        document.body.style.overflow = "auto";
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await api.get("/jobs/my-jobs");
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.error("Failed to fetch my jobs:", err);
            setError(err.response?.data?.message || "Failed to load your posted jobs.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelJob = async (jobId) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this job? This cannot be undone.");
        if (!isConfirmed) return;

        try {
            await api.patch(`/jobs/${jobId}/cancel`);
            fetchMyJobs();
        } catch (err) {
            console.error("Failed to cancel job:", err);
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

                .page-container {
                    animation: zoomInScale 0.7s cubic-bezier(0.19, 1, 0.22, 1);
                }

                @keyframes zoomInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .job-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                    margin-top: 40px;
                }
                `}
            </style>

            <div style={styles.container} className="page-container">
                <header style={styles.header}>
                    <h1 style={styles.title}>Jobs Posted</h1>
                    <p style={styles.subtext}>Oversee and control your published job listings</p>
                </header>

                {jobs.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
                        <h3 style={styles.cinzelTitle}>No Active Listings</h3>
                        <p style={styles.interText}>You haven't posted any jobs yet. Ready to find top-tier talent?</p>
                        <Link to="/create-job" style={styles.createButton}>Post a New Job</Link>
                    </div>
                ) : (
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onCancel={handleCancelJob}
                            />
                        ))}
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
        padding: '80px 20px',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    container: {
        width: '100%',
        maxWidth: '1200px',
        background: '#FFFFFF',
        borderRadius: '40px',
        padding: '60px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
        border: '4px solid #EDF1D6' // THICKER MASTER BORDER
    },
    header: { textAlign: 'center', marginBottom: '50px' },
    title: {
        fontFamily: 'Cinzel',
        fontSize: '3.2rem',
        color: '#2c3828',
        margin: 0,
        fontWeight: '600',
        letterSpacing: '-1px'
    },
    subtext: {
        color: '#609966',
        fontSize: '1.2rem',
        marginTop: '10px',
        fontWeight: '600',
        fontFamily: 'Inter'
    },
    emptyState: {
        textAlign: 'center',
        padding: '80px 40px',
        background: '#F8FBF5',
        borderRadius: '32px',
        border: '3px dashed #EDF1D6'
    },
    cinzelTitle: {
        fontFamily: 'Cinzel',
        color: '#2c3828',
        fontSize: '2.2rem',
        fontWeight: '900',
        marginBottom: '15px'
    },
    interText: {
        color: '#40513B',
        fontSize: '1.1rem',
        marginBottom: '30px',
        fontWeight: '500'
    },
    createButton: {
        display: 'inline-block',
        padding: '18px 40px',
        background: '#609966',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '18px',
        fontWeight: '900',
        fontFamily: 'Cinzel',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(96, 153, 102, 0.3)'
    },
    loadingWrapper: {
        height: '100vh',
        background: '#2c3828',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default MyPostedJobs;