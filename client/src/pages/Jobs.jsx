import { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        fetchJobs();
        document.body.style.overflow = "auto";
    }, [location, sort]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ search, location, sort }).toString();
            const res = await api.get(`/jobs?${params}`);
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.error("Fetch jobs failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');

                .marketplace-container {
                    animation: zoomInScale 0.8s cubic-bezier(0.19, 1, 0.22, 1);
                }

                @keyframes zoomInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(30px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .premium-filter-bar {
                    backdrop-filter: blur(15px);
                    background: rgba(248, 251, 245, 0.85) !important;
                    border: 1px solid rgba(157, 192, 139, 0.3) !important;
                    position: sticky;
                    top: 20px;
                    z-index: 100;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                }

                .job-grid-item {
                    animation: slideUp 0.5s ease forwards;
                    opacity: 0;
                }

                @keyframes slideUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: #609966 !important;
                    background: #FFFFFF !important;
                    box-shadow: 0 0 0 4px rgba(157, 192, 139, 0.2);
                }

                .search-pulse {
                    animation: pulseGlow 2s infinite;
                }

                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(96, 153, 102, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(96, 153, 102, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(96, 153, 102, 0); }
                }
                `}
            </style>

            <div style={styles.container} className="marketplace-container">
                <header style={styles.header}>
                    <span style={styles.cinzelLabel}>Opportunity Marketplace</span>
                    <h1 style={styles.title}>Find Your Best Match</h1>
                </header>

                {/* ✅ ENHANCED FILTER BAR */}
                <form onSubmit={handleSearchSubmit} style={styles.filterBar} className="premium-filter-bar">
                    <div style={styles.inputGroup}>
                        <label style={styles.cinzelLabelSmall}>Keywords</label>
                        <input
                            type="text"
                            placeholder="Design, Delivery, Tech..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.cinzelLabelSmall}>Location</label>
                        <select value={location} onChange={(e) => setLocation(e.target.value)} style={styles.select}>
                            <option value="">All Regions</option>
                            <option value="Pune">Pune</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.cinzelLabelSmall}>Sort By</label>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
                            <option value="newest">Newest Arrival</option>
                            <option value="salary_high">Highest Pay</option>
                            <option value="salary_low">Budget Friendly</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.searchBtn} className="search-pulse">
                        Explore
                    </button>
                </form>

                {loading ? (
                    <div style={styles.loadingWrapper}>
                        <div className="loader"></div>
                        <p style={styles.loadingText}>Curating your matches...</p>
                        <style>{`.loader{border:4px solid #EDF1D6;border-top:4px solid #609966;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;margin:0 auto 20px;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <div key={job.id} className="job-grid-item" style={{ animationDelay: `${index * 0.1}s`, transform: 'translateY(20px)' }}>
                                    <JobCard job={job} />
                                </div>
                            ))
                        ) : (
                            <div style={styles.noResults}>
                                <div style={styles.emptyIcon}>🍃</div>
                                <h3 style={styles.cinzelTitle}>No Gigs Found</h3>
                                <p style={styles.interBody}>Try adjusting your filters or searching for different keywords.</p>
                            </div>
                        )}
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
        padding: '60px 20px',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    container: {
        width: '100%',
        maxWidth: '1250px',
        background: '#FFFFFF',
        borderRadius: '45px',
        padding: '70px',
        boxShadow: '0 50px 120px rgba(0,0,0,0.5)',
        position: 'relative'
    },
    header: { marginBottom: '50px', textAlign: 'center' },
    cinzelLabel: { fontFamily: 'Cinzel', color: '#609966', letterSpacing: '3px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase' },
    title: { fontFamily: 'Cinzel', fontSize: '3.2rem', color: '#2c3828', margin: '10px 0 0', letterSpacing: '-1.5px' },
    filterBar: {
        display: "flex",
        gap: "20px",
        marginBottom: "60px",
        flexWrap: "wrap",
        padding: "35px",
        borderRadius: "30px",
        alignItems: "flex-end"
    },
    inputGroup: { flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' },
    cinzelLabelSmall: { fontFamily: 'Cinzel', fontSize: '0.7rem', color: '#40513B', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' },
    input: {
        padding: "18px", borderRadius: "16px", border: "1px solid #EDF1D6", background: "#FFFFFF",
        fontFamily: 'Inter', fontSize: '1rem', color: '#2c3828', transition: 'all 0.3s ease'
    },
    select: {
        padding: "18px", borderRadius: "16px", border: "1px solid #EDF1D6", background: "#FFFFFF",
        fontFamily: 'Inter', fontSize: '1rem', color: '#2c3828', cursor: 'pointer', transition: 'all 0.3s ease'
    },
    searchBtn: {
        padding: "18px 50px", background: "#609966", color: "white", border: "none", borderRadius: "18px",
        cursor: "pointer", fontFamily: 'Cinzel', fontWeight: "700", fontSize: '1.1rem', letterSpacing: '2px', transition: 'all 0.4s ease'
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "30px" },
    loadingWrapper: { textAlign: 'center', padding: '100px 0' },
    loadingText: { fontFamily: 'Inter', color: '#609966', fontWeight: '600', fontSize: '1.1rem' },
    noResults: { textAlign: 'center', gridColumn: '1 / -1', padding: '80px' },
    emptyIcon: { fontSize: '4rem', marginBottom: '20px' },
    cinzelTitle: { fontFamily: 'Cinzel', color: '#2c3828', fontSize: '2rem' },
    interBody: { fontFamily: 'Inter', color: '#609966', fontSize: '1.1rem' }
};

export default Jobs;