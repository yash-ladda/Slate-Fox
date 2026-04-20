import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../utils/auth";

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const currentUser = getUser();
    const isMyProfile = String(currentUser?.id) === String(userId);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchProfile();
        document.body.style.overflow = "auto";
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/auth/profile/${userId}`);
            setProfileData(res.data.user);
        } catch (err) {
            console.error("Profile Fetch Error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={styles.loadingWrapper}><div className="loader"></div></div>;

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@900&family=Inter:wght@400;700;900&display=swap');
                
                .master-container {
                    animation: profilePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    background: #FFFFFF;
                    /* MASTER BORDER SYSTEM */
                    border: 10px solid #2c3828; 
                    outline: 4px solid #609966;
                    outline-offset: -14px;
                    box-shadow: 25px 25px 0px rgba(44, 56, 40, 0.2);
                }

                @keyframes profilePop {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .profile-header {
                    background: #2c3828;
                    padding: 50px;
                    display: flex;
                    align-items: center;
                    gap: 40px;
                    border-bottom: 10px solid #609966;
                }

                .data-row {
                    border-bottom: 4px solid #F8FBF5;
                    padding: 25px 0;
                    transition: 0.3s ease;
                }

                .data-row:hover {
                    border-bottom-color: #9DC08B;
                    transform: translateX(10px);
                }

                .edit-pill {
                    transition: all 0.3s ease;
                }

                .edit-pill:hover {
                    background: #609966 !important;
                    border-color: #609966 !important;
                    transform: rotate(3deg) scale(1.1);
                }

                .loader { 
                    border: 6px solid #EDF1D6; 
                    border-top: 6px solid #609966; 
                    border-radius: 50%; 
                    width: 60px; height: 60px; 
                    animation: spin 1s linear infinite; 
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                `}
            </style>

            <div style={styles.container} className="master-container">
                {/* --- INTEGRATED TOP PANEL --- */}
                <div className="profile-header">
                    <div style={styles.imgBox}>
                        {profileData.profile_image ? (
                            <img src={profileData.profile_image} alt="user" style={styles.img} />
                        ) : (
                            <div style={styles.noImg}>{profileData.name.charAt(0)}</div>
                        )}
                        <div style={styles.activeHalo}></div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={styles.topTag}>{profileData.role === "worker" ? "Worker" : "Recruiter"}</p>
                        <h1 style={styles.nameHeader}>{profileData.name}</h1>
                        <div style={styles.metrics}>
                            <span style={styles.ratingPill}>Rating: {profileData.avgRating || "0.0"} / 5.0</span>
                            <span style={styles.metaInfo}>TOTAL REVIEWS {profileData.reviewCount || 0}</span>
                        </div>
                    </div>

                    {isMyProfile && (
                        <button
                            onClick={() => navigate(`/auth/profile/${userId}/edit`)}
                            style={styles.editPill}
                            className="edit-pill"
                        >
                            EDIT
                        </button>
                    )}
                </div>

                {/* --- INTEGRATED DATA PANEL --- */}
                <div style={styles.bodyContent}>
                    <div className="data-row">
                        <label style={styles.fieldLabel}>BIO</label>
                        <p style={styles.bioBody}>{profileData.bio || "No bio defined for this identity."}</p>
                    </div>

                    <div style={styles.splitRow}>
                        <div className="data-row" style={{ flex: 1 }}>
                            <label style={styles.fieldLabel}>EMAIL</label>
                            <p style={styles.valueLarge}>{profileData.email}</p>
                        </div>
                        <div className="data-row" style={{ flex: 1 }}>
                            <label style={styles.fieldLabel}>PHONE</label>
                            <p style={styles.valueLarge}>{profileData.phone || "STRICTLY ENCRYPTED"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px'
    },
    container: {
        width: '100%', maxWidth: '950px'
    },
    imgBox: { position: 'relative' },
    img: { width: '160px', height: '160px', objectFit: 'cover', border: '6px solid #609966', borderRadius: '4px' },
    noImg: {
        width: '160px', height: '160px', background: '#EDF1D6', color: '#2c3828',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', fontFamily: 'Cinzel', fontWeight: '900', border: '6px solid #609966'
    },
    activeHalo: {
        position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px',
        background: '#9DC08B', border: '6px solid #2c3828', borderRadius: '50%', boxShadow: '0 0 20px #9DC08B'
    },
    topTag: { fontFamily: 'Inter', fontWeight: '900', fontSize: '0.85rem', color: '#609966', letterSpacing: '5px', margin: '0 0 10px 0' },
    nameHeader: { fontFamily: 'Cinzel', fontSize: '3.5rem', margin: 0, lineHeight: '1', fontWeight: '900', color: '#EDF1D6' },
    metrics: { display: 'flex', alignItems: 'center', gap: '25px', marginTop: '20px' },
    ratingPill: { background: '#609966', color: 'white', padding: '8px 20px', fontWeight: '900', fontFamily: 'Inter', fontSize: '0.8rem' },
    metaInfo: { fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: '800', color: '#9DC08B', letterSpacing: '1px' },

    editPill: {
        width: '100px', height: '100px', borderRadius: '50%', background: 'transparent', color: '#EDF1D6',
        border: '4px solid #609966', fontWeight: '900', cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.9rem'
    },

    bodyContent: { padding: '50px', background: '#FFFFFF' },
    fieldLabel: { fontFamily: 'Cinzel', fontSize: '0.85rem', color: '#609966', fontWeight: '900', letterSpacing: '2px', display: 'block', marginBottom: '8px' },
    bioBody: { fontFamily: 'Inter', fontSize: '1.3rem', color: '#2c3828', fontWeight: '700', margin: 0, lineHeight: '1.7' },
    splitRow: { display: 'flex', gap: '50px', flexWrap: 'wrap' },
    valueLarge: { fontFamily: 'Inter', fontSize: '1.2rem', color: '#2c3828', fontWeight: '900', margin: 0, textTransform: 'uppercase' },

    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default Profile;