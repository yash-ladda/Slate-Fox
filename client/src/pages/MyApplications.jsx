import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
        document.body.style.overflow = "auto";
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/me');
            let appsArray = Array.isArray(response.data) ? response.data : (response.data?.applications || []);
            setApplications(appsArray);
        } catch (err) {
            console.error("Failed to load applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelApplication = async (jobId) => {
        if (!window.confirm("Withdraw this application?")) return;
        try {
            await api.delete(`/applications/jobs/${jobId}/cancel`);
            fetchApplications();
        } catch (err) { console.error(err); }
    };

    // ✅ Meaningful Status Logic
    const getMeaningfulStatus = (appStatus, jobStatus) => {
        const status = appStatus?.toLowerCase();
        const job = jobStatus?.toLowerCase();

        if (job === 'cancelled') return { text: 'Job Cancelled', bg: '#FFECEC', color: '#AE2E2E' };
        if (status === 'accepted') return { text: 'Secured', bg: '#609966', color: '#FFFFFF' };
        if (status === 'rejected') return { text: 'Not Selected', bg: '#FFECEC', color: '#AE2E2E' };

        // If still pending but job moved on
        if (job === 'completed') return { text: 'Closed', bg: '#EDF1D6', color: '#40513B' };
        if (job === 'in_progress') return { text: 'In Progress', bg: '#EDF1D6', color: '#609966' };

        return { text: 'Pending Review', bg: '#F8FBF5', color: '#609966' };
    };

    if (loading) return <div style={styles.loadingWrapper}><div className="loader"></div></div>;

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
                .app-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid #EDF1D6; animation: zoomInScale 0.6s ease forwards; }
                .app-card:hover { transform: translateY(-5px) scale(1.01); background: #FFFFFF !important; border-color: #9DC08B; box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
                @keyframes zoomInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .loader { border: 4px solid #40513B; border-top: 4px solid #9DC08B; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                `}
            </style>

            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Application Tracker</h1>
                    <p style={styles.subtext}>Manage your active interests and past engagements</p>
                </header>

                {applications.length === 0 ? (
                    <div style={styles.emptyState}>
                        <h3 style={styles.cinzelTitle}>No History Found</h3>
                        <Link to="/jobs" style={styles.browseButton}>Find Jobs</Link>
                    </div>
                ) : (
                    <div style={styles.list}>
                        {applications.map((app) => {
                            const job = app.jobs || {};
                            const statusDisplay = getMeaningfulStatus(app.status, job.status);
                            const isJobOpen = job.status === 'open';

                            return (
                                <div key={app.id} style={styles.card} className="app-card">
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <h3 style={styles.jobTitle}>{job.title}</h3>
                                            <span style={styles.jobState}>
                                                {isJobOpen ? "🟢 Accepting Apps" : `⚪ ${job.status.replace('_', ' ')}`}
                                            </span>
                                        </div>
                                        <span style={{ ...styles.badge, background: statusDisplay.bg, color: statusDisplay.color }}>
                                            {statusDisplay.text}
                                        </span>
                                    </div>

                                    <div style={styles.cardBody}>
                                        <div style={styles.detailItem}>
                                            <span style={styles.cinzelLabelSmall}>Location</span>
                                            <span style={styles.detailValue}>📍 {job.location}</span>
                                        </div>
                                        <div style={styles.detailItem}>
                                            <span style={styles.cinzelLabelSmall}>Pay</span>
                                            <span style={styles.detailValue}>₹{job.salary}</span>
                                        </div>
                                        <div style={styles.detailItem}>
                                            <span style={styles.cinzelLabelSmall}>Timeline</span>
                                            <span style={styles.detailValue}>{new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div style={styles.cardFooter}>
                                        {isJobOpen && app.status !== "accepted" ? (
                                            <button onClick={() => handleCancelApplication(app.job_id)} style={styles.withdrawBtn}>
                                                Withdraw
                                            </button>
                                        ) : <div />}

                                        <Link to={`/jobs/${app.job_id}`} style={styles.viewLink}>
                                            {job.status === 'completed' ? "Leave Feedback →" : "View Details →"}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)', padding: '80px 20px', display: 'flex', justifyContent: 'center' },
    container: { width: '100%', maxWidth: '850px', background: '#FFFFFF', borderRadius: '40px', padding: '60px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' },
    header: { textAlign: 'center', marginBottom: '50px' },
    title: { fontFamily: 'Cinzel', fontSize: '2.8rem', color: '#2c3828', margin: 0 },
    subtext: { color: '#609966', fontSize: '1rem', marginTop: '8px' },
    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { padding: '30px', borderRadius: '24px', background: '#F8FBF5' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    jobTitle: { fontFamily: 'Cinzel', margin: '0 0 5px 0', fontSize: '1.4rem', color: '#2c3828' },
    jobState: { fontSize: '0.75rem', color: '#609966', fontWeight: '700', textTransform: 'capitalize' },
    badge: { padding: '6px 14px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
    cardBody: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '25px' },
    detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
    cinzelLabelSmall: { fontFamily: 'Cinzel', fontSize: '0.6rem', color: '#609966', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
    detailValue: { fontSize: '0.9rem', color: '#40513B', fontWeight: '600' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #EDF1D6' },
    withdrawBtn: { background: '#FFECEC', color: '#AE2E2E', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Cinzel', fontWeight: '700', fontSize: '0.75rem' },
    viewLink: { color: '#609966', textDecoration: 'none', fontWeight: '800', fontSize: '0.85rem', fontFamily: 'Cinzel' },
    emptyState: { textAlign: 'center', padding: '60px' },
    cinzelTitle: { fontFamily: 'Cinzel', color: '#2c3828', fontSize: '1.8rem' },
    browseButton: { display: 'inline-block', padding: '14px 30px', background: '#609966', color: 'white', textDecoration: 'none', borderRadius: '16px', fontWeight: '700', fontFamily: 'Cinzel', marginTop: '20px' },
    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default MyApplications;