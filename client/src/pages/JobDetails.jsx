import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../utils/auth";
import ReviewSection from "../components/ReviewSection";

const JobDetails = () => {
    const { jobId } = useParams();
    const user = getUser();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingStatus, setIsCheckingStatus] = useState(user?.role === "worker");
    const [error, setError] = useState("");
    const [applyMsg, setApplyMsg] = useState("");
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [acceptedWorkers, setAcceptedWorkers] = useState([]);

    useEffect(() => {
        fetchJob();
        document.body.style.overflow = "auto";
    }, [jobId]);

    useEffect(() => {
        if (user?.role === "worker") checkApplicationStatus();
    }, [jobId, user?.role]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${jobId}`);
            const jobData = res.data.job;
            setJob(jobData);
            if (jobData.status === "completed" && user?.id === jobData.recruiter_id) {
                fetchAcceptedWorkers();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch job");
        } finally {
            setLoading(false);
        }
    };

    const fetchAcceptedWorkers = async () => {
        try {
            const res = await api.get(`/applications/jobs/${jobId}`);
            const apps = res.data.applications || [];
            const accepted = apps.filter(app => app.status === "accepted");
            setAcceptedWorkers(accepted);
        } catch (err) { console.error("Stats fetch failed"); }
    };

    const checkApplicationStatus = async () => {
        try {
            const res = await api.get("/applications/me");
            const appsArray = res.data.applications || [];
            const found = appsArray.find((app) => String(app.job_id) === String(jobId));
            if (found) setApplicationStatus(found.status || "applied");
        } catch (err) { console.error("Status check failed"); }
        finally { setIsCheckingStatus(false); }
    };

    const handleApply = async () => {
        try {
            const res = await api.post("/applications/apply", { jobId });
            setApplyMsg(res.data.message || "Applied successfully ✅");
            setApplicationStatus("pending");
        } catch (err) { setApplyMsg("Failed to apply"); }
    };

    const handleCancel = async () => {
        if (!window.confirm("Confirm cancellation?")) return;
        try {
            await api.patch(`/jobs/${jobId}/cancel`);
            navigate("/jobs");
        } catch (err) { setApplyMsg("Error cancelling job"); }
    };

    if (loading) return <div style={styles.loadingWrapper}><div className="loader"></div><style>{`.loader{border:4px solid #40513B;border-top:4px solid #9DC08B;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

    const isOwner = user?.id === job.recruiter_id;
    const isRecruiter = user?.role === "recruiter";
    const isCompleted = job.status === "completed";
    const isCancelled = job.status === "cancelled";
    const wasHired = !isRecruiter && applicationStatus === "accepted";

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
                .premium-box { animation: zoomInScale 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
                @keyframes zoomInScale { from { opacity: 0; transform: scale(0.92) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .internal-card { transition: all 0.3s ease; border: 1px solid #EDF1D6; }
                .internal-card:hover { border-color: #9DC08B; background: #FFFFFF !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(64, 81, 59, 0.05); }
                .nav-back:hover { color: #2c3828 !important; transform: translateX(-5px); }
                `}
            </style>

            <div style={styles.container} className="premium-box">
                <div onClick={() => navigate(-1)} style={styles.backBtn} className="nav-back">← Back</div>

                <header style={styles.header}>
                    <h1 style={styles.title}>{job.title}</h1>
                    <div style={{
                        ...styles.badge,
                        backgroundColor: isCompleted ? "#EDF1D6" : isCancelled ? "#FFECEC" : "#609966",
                        color: isCompleted ? "#40513B" : isCancelled ? "#AE2E2E" : "#FFFFFF"
                    }}>
                        {job.status.toUpperCase()}
                    </div>
                </header>

                <div style={styles.infoGrid}>
                    <div className="internal-card" style={styles.infoModule}>
                        <label style={styles.cinzelLabel}>Compensation</label>
                        <span style={styles.cinzelValue}>₹{job.salary}</span>
                    </div>
                    <div className="internal-card" style={styles.infoModule}>
                        <label style={styles.cinzelLabel}>Location</label>
                        <span style={styles.cinzelValue}>{job.location}</span>
                    </div>
                    <div className="internal-card" style={styles.infoModule}>
                        <label style={styles.cinzelLabel}>Vacancy</label>
                        <span style={styles.cinzelValue}>{job.capacity} Spots</span>
                    </div>
                </div>

                <div className="internal-card" style={styles.descriptionPanel}>
                    <h3 style={styles.panelHeading}>Job Description</h3>
                    <p style={styles.descriptionText}>{job.description}</p>
                </div>

                <div style={styles.timelineRow}>
                    <div className="internal-card" style={styles.timeBox}>
                        <label style={styles.cinzelLabel}>Schedule Starts</label>
                        <span style={styles.timeValue}>{new Date(job.scheduled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} — {new Date(job.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="internal-card" style={styles.timeBox}>
                        <label style={styles.cinzelLabel}>Schedule Ends</label>
                        <span style={styles.timeValue}>{new Date(job.ends_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} — {new Date(job.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {!isOwner && (
                    <Link to={`/auth/profile/${job.recruiter?.id}`} style={styles.recruiterLink}>
                        <div className="internal-card" style={styles.recruiterCard}>
                            <div style={styles.avatar}>{job.recruiter?.name?.charAt(0)}</div>
                            <div style={{ flex: 1 }}>
                                <span style={styles.cinzelLabel}>Manager</span>
                                <h4 style={styles.recruiterName}>{job.recruiter?.name}</h4>
                            </div>
                            <div style={styles.arrowIcon}>VIEW PROFILE →</div>
                        </div>
                    </Link>
                )}

                <footer style={styles.footer}>
                    {isOwner && (
                        <div style={styles.btnGroup}>
                            {/* Modify sirf tabhi dikhega jab job active ho */}
                            {!isCompleted && !isCancelled && (
                                <button onClick={() => navigate(`/jobs/${job.id}/edit`)} style={styles.btnSecondary}>Modify Job</button>
                            )}

                            {/* Applicants humesha dikhenge recruiter ko records ke liye */}
                            <button onClick={() => navigate(`/applications/jobs/${job.id}`)} style={styles.btnPrimary}>See Applicants</button>

                            {/* Cancel sirf Open status par hi allowed hai */}
                            {job.status === 'open' && (
                                <button onClick={handleCancel} style={styles.btnDanger}>Cancel Job</button>
                            )}
                        </div>
                    )}

                    {!isRecruiter && job.status === "open" && (
                        <div style={{ width: '100%' }}>
                            {!applicationStatus ? (
                                <button onClick={handleApply} style={styles.applyBtn}>Request to Join Gig</button>
                            ) : (
                                <div style={styles.statusBanner}>Status: <strong>{applicationStatus.toUpperCase()}</strong></div>
                            )}
                        </div>
                    )}
                </footer>

                {isCompleted && (
                    <div style={styles.reviewSection}>
                        <h3 style={styles.panelHeading}>Performance Feedback</h3>
                        {isOwner ? (
                            acceptedWorkers.map(app => <ReviewSection key={app.worker_id} jobId={job.id} revieweeId={app.worker_id} revieweeName={app.worker?.name} />)
                        ) : wasHired && <ReviewSection jobId={job.id} revieweeId={job.recruiter_id} revieweeName={job.recruiter?.name} />}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)', padding: '80px 20px', fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
    container: { width: '100%', maxWidth: '800px', background: '#FFFFFF', borderRadius: '36px', padding: '60px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', position: 'relative' },
    backBtn: { fontFamily: 'Cinzel', fontSize: '0.8rem', color: '#609966', cursor: 'pointer', marginBottom: '30px', fontWeight: '700', transition: 'all 0.3s ease', display: 'inline-block' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '2px solid #F8FBF5', paddingBottom: '20px' },
    title: { fontFamily: 'Cinzel', fontSize: '2.8rem', color: '#2c3828', margin: 0, letterSpacing: '-1px' },
    badge: { padding: '10px 24px', borderRadius: '40px', fontSize: '0.8rem', fontFamily: 'Inter', fontWeight: '800', letterSpacing: '1px' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
    infoModule: { background: '#F8FBF5', padding: '25px', borderRadius: '24px', textAlign: 'center' },
    cinzelLabel: { fontFamily: 'Cinzel', fontSize: '0.75rem', color: '#609966', fontWeight: '700', letterSpacing: '1.5px', display: 'block', marginBottom: '10px', textTransform: 'uppercase' },
    cinzelValue: { fontFamily: 'Cinzel', fontSize: '1.4rem', fontWeight: '700', color: '#2c3828' },
    descriptionPanel: { background: '#FFFFFF', padding: '35px', borderRadius: '28px', marginBottom: '40px' },
    panelHeading: { fontFamily: 'Cinzel', fontSize: '1.4rem', color: '#2c3828', marginBottom: '20px', borderLeft: '4px solid #609966', paddingLeft: '15px' },
    descriptionText: { color: '#40513B', lineHeight: '1.8', fontSize: '1.1rem', margin: 0, fontWeight: '400' },
    timelineRow: { display: 'flex', gap: '20px', marginBottom: '40px' },
    timeBox: { flex: 1, background: '#F8FBF5', padding: '25px', borderRadius: '24px' },
    timeValue: { fontSize: '1rem', color: '#2c3828', fontWeight: '600', display: 'block' },
    recruiterLink: { textDecoration: 'none' },
    recruiterCard: { background: '#EDF1D6', padding: '25px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px' },
    avatar: { width: '60px', height: '60px', borderRadius: '20px', background: '#609966', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 10px 20px rgba(96, 153, 102, 0.2)' },
    recruiterName: { fontFamily: 'Cinzel', margin: 0, fontSize: '1.3rem', color: '#2c3828', letterSpacing: '0.5px' },
    arrowIcon: { fontFamily: 'Cinzel', fontSize: '0.7rem', color: '#609966', fontWeight: '800', letterSpacing: '1px' },
    footer: { borderTop: '2px solid #EDF1D6', paddingTop: '50px' },
    btnGroup: { display: 'flex', gap: '15px' },
    btnPrimary: { flex: 2, padding: '20px', background: '#609966', color: '#fff', border: 'none', borderRadius: '18px', fontFamily: 'Cinzel', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', letterSpacing: '1px' },
    btnSecondary: { flex: 1, padding: '20px', background: '#F8FBF5', color: '#40513B', border: '1px solid #EDF1D6', borderRadius: '18px', fontFamily: 'Cinzel', fontWeight: '700', cursor: 'pointer' },
    btnDanger: { padding: '20px', background: '#FFECEC', color: '#AE2E2E', border: 'none', borderRadius: '18px', fontFamily: 'Cinzel', fontWeight: '700', cursor: 'pointer' },
    applyBtn: { width: '100%', padding: '24px', background: '#609966', color: '#fff', border: 'none', borderRadius: '20px', fontFamily: 'Cinzel', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', letterSpacing: '2px', boxShadow: '0 15px 30px rgba(96, 153, 102, 0.3)' },
    statusBanner: { padding: '24px', background: '#EDF1D6', color: '#40513B', textAlign: 'center', borderRadius: '20px', fontFamily: 'Cinzel', fontWeight: '700', fontSize: '1.1rem' },
    reviewSection: { marginTop: '50px' },
    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default JobDetails;