import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchApplications();
        document.body.style.overflow = "auto";
    }, [jobId]);

    useEffect(() => {
        let result = [...applications];

        if (statusFilter !== "all") {
            result = result.filter(app => app.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === "rating_high") {
                return (b.worker?.avgRating || 0) - (a.worker?.avgRating || 0);
            }
            if (sortBy === "reviews_high") {
                return (b.worker?.reviewCount || 0) - (a.worker?.reviewCount || 0);
            }
            if (sortBy === "newest") {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

        setFilteredApps(result);
    }, [applications, statusFilter, sortBy]);

    const fetchApplications = async () => {
        try {
            const res = await api.get(`/applications/jobs/${jobId}`);
            const appsArray = res.data.applications || res.data || [];
            setApplications(Array.isArray(appsArray) ? appsArray : []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (application_id, status) => {
        try {
            const res = await api.patch(`/applications/${application_id}`, { status });
            setMessage(res.data.message || `Application ${status} ✅`);
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === application_id ? { ...app, status } : app
                )
            );
        } catch (err) {
            setMessage("Update failed");
        }
    };

    if (loading) return (
        <div style={styles.loadingWrapper}>
            <div className="loader"></div>
            <style>{`.loader{border:4px solid #F8FBF5;border-top:4px solid #609966;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');

                .apps-container {
                    animation: zoomInScale 0.7s cubic-bezier(0.19, 1, 0.22, 1);
                }

                @keyframes zoomInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .applicant-card {
                    transition: all 0.3s ease;
                    border: 1px solid #EDF1D6;
                }

                .applicant-card:hover {
                    transform: translateY(-4px);
                    background: #F8FBF5 !important;
                    border-color: #9DC08B;
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05);
                }

                .action-btn:hover {
                    filter: brightness(1.1);
                    transform: scale(1.05);
                }
                `}
            </style>

            <div style={styles.container} className="apps-container">
                <header style={styles.header}>
                    <h1 style={styles.title}>Job Applicants</h1>
                    <p style={styles.subtext}>Review and manage candidates for this job</p>
                </header>

                {/* --- FILTER BAR --- */}
                <div style={styles.filterBar}>
                    <div style={styles.filterGroup}>
                        <label style={styles.cinzelLabel}>Filter Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                            <option value="all">All Applications</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.cinzelLabel}>Sort Candidates</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
                            <option value="newest">Recently Applied</option>
                            <option value="rating_high">Top Rated</option>
                            <option value="reviews_high">Experience Level</option>
                        </select>
                    </div>
                </div>

                {message && <div style={{ ...styles.msgBox, background: message.includes("failed") ? "#FFECEC" : "#EDF1D6" }}>{message}</div>}

                {filteredApps.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={styles.interText}>No matching applicants found.</p>
                    </div>
                ) : (
                    <div style={styles.list}>
                        {filteredApps.map((app) => (
                            <div key={app.id} style={styles.card} className="applicant-card">
                                <div style={styles.profileArea} onClick={() => navigate(`/auth/profile/${app.worker?.id}`)}>
                                    {app.worker?.profile_image ? (
                                        <img src={app.worker.profile_image} alt="" style={styles.avatar} />
                                    ) : (
                                        <div style={styles.avatarPlaceholder}>
                                            {app.worker?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div style={styles.info}>
                                        <h4 style={styles.name}>{app.worker?.name}</h4>
                                        <div style={styles.ratingRow}>
                                            <span style={styles.star}>★ {app.worker?.avgRating || "0.0"}</span>
                                            <span style={styles.reviewCount}>({app.worker?.reviewCount || 0} reviews)</span>
                                        </div>
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: app.status === 'accepted' ? '#EDF1D6' : app.status === 'rejected' ? '#FFECEC' : '#F8FBF5',
                                            color: app.status === 'accepted' ? '#40513B' : app.status === 'rejected' ? '#AE2E2E' : '#609966'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                {app.status === "pending" && (
                                    <div style={styles.actions}>
                                        <button
                                            onClick={() => handleUpdate(app.id, "accepted")}
                                            className="action-btn"
                                            style={styles.acceptBtn}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(app.id, "rejected")}
                                            className="action-btn"
                                            style={styles.rejectBtn}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
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
        justifyContent: 'center'
    },
    container: {
        width: '100%',
        maxWidth: '850px',
        background: '#FFFFFF',
        borderRadius: '40px',
        padding: '60px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontFamily: 'Cinzel', fontSize: '2.5rem', color: '#2c3828', margin: 0 },
    subtext: { color: '#609966', fontSize: '1rem', marginTop: '8px' },

    filterBar: {
        display: 'flex',
        justifyContent: 'space-between',
        background: '#F8FBF5',
        padding: '25px',
        borderRadius: '24px',
        marginBottom: '40px',
        border: '1px solid #EDF1D6',
        gap: '20px',
        flexWrap: 'wrap'
    },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    cinzelLabel: {
        fontFamily: 'Cinzel',
        fontSize: '0.7rem',
        fontWeight: '700',
        color: '#609966',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    select: {
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #EDF1D6',
        fontFamily: 'Inter',
        outline: 'none',
        background: '#FFFFFF',
        cursor: 'pointer'
    },

    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px',
        borderRadius: '24px',
        background: '#FFFFFF'
    },
    profileArea: { display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', flex: 1 },
    avatar: { width: '70px', height: '70px', borderRadius: '20px', objectFit: 'cover', border: '2px solid #EDF1D6' },
    avatarPlaceholder: {
        width: '70px',
        height: '70px',
        borderRadius: '20px',
        backgroundColor: '#609966',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontFamily: 'Cinzel',
        fontWeight: 'bold'
    },
    info: { display: 'flex', flexDirection: 'column', gap: '4px' },
    name: { fontFamily: 'Cinzel', fontSize: '1.2rem', color: '#2c3828', margin: 0 },
    ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    star: { color: '#609966', fontWeight: '800', fontSize: '0.9rem' },
    reviewCount: { color: '#888', fontSize: '0.8rem', fontFamily: 'Inter' },
    statusBadge: {
        fontSize: '0.65rem',
        padding: '4px 12px',
        borderRadius: '30px',
        width: 'fit-content',
        textTransform: 'uppercase',
        fontWeight: '800',
        letterSpacing: '1px',
        marginTop: '5px'
    },

    actions: { display: 'flex', gap: '10px' },
    acceptBtn: {
        background: '#609966',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '14px',
        fontFamily: 'Cinzel',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    rejectBtn: {
        background: '#FFFFFF',
        color: '#AE2E2E',
        padding: '12px 24px',
        border: '1px solid #FFECEC',
        borderRadius: '14px',
        fontFamily: 'Cinzel',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },

    msgBox: { textAlign: 'center', padding: '15px', borderRadius: '16px', marginBottom: '30px', fontFamily: 'Inter', fontWeight: '600' },
    emptyState: { textAlign: 'center', padding: '60px' },
    interText: { fontFamily: 'Inter', color: '#609966' },
    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default JobApplications;