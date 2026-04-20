import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const JobCard = ({ job, onApply, applicationStatus, isCheckingStatus, onCancel }) => {
    const navigate = useNavigate();
    const user = getUser();

    const isOwner = user?.id === job.recruiter_id;
    const isWorker = user?.role === "worker";

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const canCancel = isOwner && job?.status === "open";

    return (
        <div className="job-card-wrapper" style={styles.cardWrapper}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;700&display=swap');

                .job-card-wrapper {
                    /* FAINT GREEN GRADIENT BACKGROUND */
                    background: linear-gradient(145deg, #F8FBF5 0%, #EDF1D6 100%);
                    border: 1px solid rgba(157, 192, 139, 0.3);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .job-card-wrapper:hover {
                    transform: translateY(-10px) scale(1.03); /* ZOOM IN EFFECT */
                    background: #FFFFFF; /* Shifts to White for "Pop" effect */
                    box-shadow: 0 25px 50px rgba(44, 56, 40, 0.15);
                    border-color: #609966;
                }

                .status-floating {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    padding: 5px 14px;
                    border-radius: 30px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    font-family: 'Inter', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .card-link {
                    text-decoration: none;
                    display: block;
                    padding: 30px;
                }

                .btn-premium {
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-family: 'Cinzel', serif;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    border: none;
                }

                .btn-premium:hover {
                    filter: brightness(1.1);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(96, 153, 102, 0.3);
                }
                `}
            </style>

            {/* Status Badge */}
            <div className="status-floating" style={{
                backgroundColor: job.status === 'open' ? '#609966' : job.status === 'completed' ? '#2c3828' : '#FFECEC',
                color: job.status === 'cancelled' ? '#AE2E2E' : '#FFFFFF'
            }}>
                {job.status}
            </div>

            <a href={`/jobs/${job.id}`} className="card-link">
                <h3 style={styles.title}>{job.title}</h3>

                <div style={styles.metaGrid}>
                    <div style={styles.metaItem}>
                        <span style={styles.cinzelLabel}>Location</span>
                        <span style={styles.interValue}>📍 {job.location}</span>
                    </div>
                    <div style={styles.metaItem}>
                        <span style={styles.cinzelLabel}>Budget</span>
                        <span style={styles.interValue}>₹{job.salary}</span>
                    </div>
                </div>

                <div style={styles.dateSection}>
                    <p style={styles.dateText}>
                        <span style={styles.cinzelLabel}>Scheduled</span>
                        <span style={styles.interDate}>{formatDate(job.scheduled_at)}</span>
                    </p>
                </div>

                <div style={styles.capacityBar}>
                    <div style={styles.labelRow}>
                        <span style={styles.cinzelLabel}>Slots</span>
                        <span style={styles.interValueSmall}>{job.capacity}/{job.max_applications}</span>
                    </div>
                    <div style={styles.progressContainer}>
                        <div style={{
                            ...styles.progressBar,
                            width: `${(job.capacity / job.max_applications) * 100}%`
                        }}></div>
                    </div>
                </div>
            </a>

            {/* --- ACTIONS --- */}
            <div style={styles.actionArea}>
                {isOwner && (
                    <div style={styles.btnGroup}>
                        {job?.status === "open" && (
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/jobs/${job.id}/edit`); }}
                                style={{ ...styles.baseBtn, ...styles.updateBtn }}
                                className="btn-premium"
                            >
                                Modify
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/applications/jobs/${job.id}`); }}
                            style={{ ...styles.baseBtn, ...styles.applicantsBtn }}
                            className="btn-premium"
                        >
                            Applicants
                        </button>
                        {onCancel && canCancel && (
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel(job.id); }}
                                style={{ ...styles.baseBtn, ...styles.cancelBtn }}
                                className="btn-premium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}

                {isWorker && (
                    <div style={styles.workerArea}>
                        {isCheckingStatus ? (
                            <p style={styles.grayText}>Verifying status...</p>
                        ) : (
                            <>
                                {onApply && !applicationStatus && job?.status === "open" && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onApply(job.id); }}
                                        style={styles.applyBtn}
                                        className="btn-premium"
                                    >
                                        Apply Now
                                    </button>
                                )}
                                {applicationStatus && (
                                    <div style={styles.statusBox}>
                                        <span style={styles.cinzelLabel}>Current Status</span>
                                        <span style={styles.statusValue}>{applicationStatus}</span>
                                    </div>
                                )}
                                {!applicationStatus && job?.status !== "open" && (
                                    <p style={styles.grayText}>Applications Closed</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    cardWrapper: {
        borderRadius: '32px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontFamily: 'Cinzel, serif',
        fontSize: '1.6rem',
        color: '#2c3828',
        margin: '0 0 20px 0',
        paddingRight: '40px',
        lineHeight: '1.2',
        fontWeight: '700'
    },
    metaGrid: {
        display: 'flex',
        gap: '25px',
        marginBottom: '20px'
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    cinzelLabel: {
        fontFamily: 'Cinzel, serif',
        fontSize: '0.65rem',
        color: '#609966',
        fontWeight: '700',
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
    },
    interValue: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#40513B'
    },
    interValueSmall: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#40513B'
    },
    dateSection: {
        padding: '15px 0',
        borderTop: '1px solid rgba(157, 192, 139, 0.2)',
        marginBottom: '15px'
    },
    dateText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        margin: 0
    },
    interDate: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.9rem',
        color: '#2c3828',
        fontWeight: '500'
    },
    capacityBar: {
        marginBottom: '10px'
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    progressContainer: {
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(157, 192, 139, 0.1)'
    },
    progressBar: {
        height: '100%',
        background: 'linear-gradient(90deg, #9DC08B, #609966)',
        borderRadius: '10px'
    },
    actionArea: {
        padding: '0 30px 30px 30px',
        marginTop: 'auto'
    },
    btnGroup: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    baseBtn: {
        padding: '12px 18px',
        borderRadius: '14px',
        fontSize: '0.75rem',
    },
    updateBtn: { background: '#EDF1D6', color: '#40513B' },
    applicantsBtn: { background: '#609966', color: '#FFFFFF' },
    cancelBtn: { background: '#FFECEC', color: '#AE2E2E' },
    applyBtn: {
        width: '100%',
        padding: '16px',
        background: '#609966',
        color: '#FFFFFF',
        borderRadius: '16px',
        fontSize: '1rem',
        boxShadow: '0 10px 20px rgba(96, 153, 102, 0.2)'
    },
    statusBox: {
        background: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #EDF1D6'
    },
    statusValue: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '800',
        color: '#609966',
        textTransform: 'uppercase',
        fontSize: '0.75rem'
    },
    grayText: {
        fontFamily: 'Inter, sans-serif',
        color: '#609966',
        fontStyle: 'italic',
        fontSize: '0.85rem',
        textAlign: 'center'
    }
};

export default JobCard;