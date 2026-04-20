import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getUser } from '../utils/auth';

const Dashboard = () => {
    const user = getUser();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/jobs/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Stats fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
        document.body.style.overflow = "auto";
    }, []);

    if (!user || loading || !stats) {
        return (
            <div style={styles.loadingWrapper}>
                <div className="loader"></div>
                <p style={{ fontFamily: 'Inter', color: '#609966', marginTop: '20px' }}>Fetching your dashboard...</p>
                <style>{`.loader { border: 4px solid #EDF1D6; border-top: 4px solid #609966; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.glow}></div>

            <div style={styles.container}>
                <header style={styles.hero}>
                    <div>
                        <h1 style={styles.greeting}>Welcome, {user.name}! 👋</h1>
                        <p style={styles.subtext}>Here is what's happening with your gigs today.</p>
                    </div>
                    <span style={styles.roleBadge}>{user.role.toUpperCase()}</span>
                </header>

                {/* --- PREMIUM STATS ROW --- */}
                <div style={styles.statsRow}>
                    {user.role === 'worker' ? (
                        <>
                            <div className="stat-card" style={styles.statCard}>
                                <span style={styles.statNumber}>{stats.totalApplications}</span>
                                <span style={styles.statLabel}>Applications Sent</span>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <span style={styles.statNumber}>{stats.acceptedApplications}</span>
                                <span style={styles.statLabel}>Jobs Accepted</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat-card" style={styles.statCard}>
                                <span style={styles.statNumber}>{stats.totalPostedJobs}</span>
                                <span style={styles.statLabel}>Jobs Posted</span>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <span style={styles.statNumber}>{stats.pendingReview}</span>
                                <span style={styles.statLabel}>Pending Review</span>
                            </div>
                        </>
                    )}
                    <div className="stat-card" style={{ ...styles.statCard, background: '#609966', color: '#fff' }}>
                        <span style={styles.statNumber}>Active</span>
                        <span style={styles.statLabel}>System Status</span>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.grid}>
                    
                    {user.role === 'worker' && (
                        <Link to="/jobs" className="action-tile" style={styles.actionTile}>
                            <div style={{ ...styles.iconBox, background: '#EDF1D6', color: '#609966' }}>🔍</div>
                            <h3 style={styles.tileTitle}>Browse Jobs</h3>
                            <p style={styles.tileDesc}>Explore new opportunities tailored for you.</p>
                        </Link>
                    )}

                    {user.role === 'recruiter' && (
                        <Link to="/create-job" className="action-tile" style={styles.actionTile}>
                            <div style={{ ...styles.iconBox, background: '#F8FBF5', border: '1px solid #9DC08B', color: '#40513B' }}>➕</div>
                            <h3 style={styles.tileTitle}>Post a Job</h3>
                            <p style={styles.tileDesc}>Find the perfect talent for your next project.</p>
                        </Link>
                    )}

                    <Link to={`/auth/profile/${user.id}`} className="action-tile" style={styles.actionTile}>
                        <div style={{ ...styles.iconBox, background: '#EDF1D6', color: '#2c3828' }}>👤</div>
                        <h3 style={styles.tileTitle}>My Profile</h3>
                        <p style={styles.tileDesc}>Update your bio, skills, and portfolio.</p>
                    </Link>
                </div>
            </div>

            <style>
                {`
                .stat-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(64, 81, 59, 0.15);
                }
                .action-tile {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
                .action-tile:hover {
                    transform: scale(1.05);
                    background: #FFFFFF !important;
                    border-color: #609966 !important;
                    box-shadow: 0 20px 40px rgba(44, 56, 40, 0.08) !important;
                }
                `}
            </style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FBF5 0%, #EDF1D6 100%)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '80px'
    },
    glow: {
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(157,192,139,0.2), transparent)',
        filter: 'blur(80px)',
        zIndex: 0
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '60px 20px',
        position: 'relative',
        zIndex: 1
    },
    loadingWrapper: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#F8FBF5'
    },
    hero: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '50px'
    },
    greeting: {
        fontFamily: 'Cinzel',
        margin: 0,
        fontSize: '2.5rem',
        color: '#2c3828',
        letterSpacing: '1px'
    },
    subtext: {
        color: '#609966',
        fontSize: '1.1rem',
        marginTop: '8px',
        fontWeight: '500'
    },
    roleBadge: {
        background: '#FFFFFF',
        color: '#609966',
        padding: '8px 20px',
        borderRadius: '30px',
        fontWeight: '800',
        fontSize: '0.8rem',
        letterSpacing: '1.5px',
        border: '2px solid #EDF1D6',
        boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
    },
    statsRow: {
        display: 'flex',
        gap: '25px',
        marginBottom: '60px',
        flexWrap: 'wrap'
    },
    statCard: {
        flex: 1,
        minWidth: '200px',
        background: '#FFFFFF',
        color: '#40513B',
        padding: '35px 25px',
        borderRadius: '28px',
        textAlign: 'center',
        border: '1px solid #EDF1D6',
        boxShadow: '0 10px 20px rgba(44, 56, 40, 0.04)'
    },
    statNumber: {
        fontSize: '3rem',
        fontWeight: '800',
        display: 'block',
        lineHeight: '1',
        marginBottom: '10px',
        fontFamily: 'Cinzel'
    },
    statLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        opacity: 0.8
    },
    sectionTitle: {
        fontFamily: 'Cinzel',
        fontSize: '1.8rem',
        color: '#2c3828',
        marginBottom: '30px',
        borderLeft: '5px solid #609966',
        paddingLeft: '15px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
    },
    actionTile: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '40px 30px',
        borderRadius: '32px',
        border: '2px solid transparent',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: '60px',
        height: '60px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        marginBottom: '20px'
    },
    tileTitle: {
        fontFamily: 'Cinzel',
        fontSize: '1.4rem',
        margin: '0 0 10px 0',
        color: '#2c3828'
    },
    tileDesc: {
        margin: 0,
        fontSize: '1rem',
        color: '#609966',
        lineHeight: '1.5'
    }
};

export default Dashboard;