import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../utils/auth";

const UpdateProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const currentUserId = getUser()?.id;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        profile_image: "",
        bio: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (String(currentUserId) !== String(userId)) {
            alert("Access Denied");
            navigate(`/auth/profile/${currentUserId || ""}`);
        } else {
            fetchProfile();
        }
        document.body.style.overflow = "auto";
    }, [userId, currentUserId, navigate]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/auth/profile/${userId}`);
            const user = res.data.user;
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                profile_image: user.profile_image || "",
                bio: user.bio || ""
            });
        } catch (err) {
            setMessage({ text: "Error loading profile.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await api.patch(`/auth/profile/${userId}`, formData);
            setMessage({ text: "Profile updated successfully ✅", type: "success" });
            setTimeout(() => navigate(`/auth/profile/${userId}`), 1500);
        } catch (err) {
            setMessage({ text: "Update failed.", type: "error" });
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={styles.loadingWrapper}>
            <div className="loader"></div>
            <style>{`.loader{border:5px solid #EDF1D6;border-top:5px solid #609966;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;}`}</style>
        </div>
    );

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;600&display=swap');
                
                .master-container {
                    animation: profilePop 0.5s ease-out;
                    background: #FFFFFF;
                    border: 8px solid #2c3828; 
                    border-radius: 40px; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
                    overflow: hidden;
                }

                @keyframes profilePop {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                input, textarea {
                    background: #F8FBF5;
                    border: 2.5px solid #EDF1D6;
                    outline: none;
                    width: 100%;
                    font-family: 'Inter', sans-serif;
                    font-size: 1.05rem;
                    color: #2c3828;
                    padding: 16px;
                    border-radius: 14px;
                    font-weight: 600; /* Balanced readability */
                    transition: all 0.3s ease;
                }

                input:focus, textarea:focus {
                    border-color: #609966;
                    background: #FFFFFF;
                    box-shadow: 0 0 0 4px rgba(96, 153, 102, 0.1);
                }

                .btn-hover { transition: all 0.3s ease; }
                .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.1); }
                `}
            </style>

            <div style={styles.container} className="master-container">
                <div style={styles.formHeader}>
                    <h1 style={styles.title}>Edit Profile</h1>
                </div>

                <div style={styles.bodyContent}>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Contact Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile number" />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Profile Pic URL</label>
                            <input type="url" name="profile_image" value={formData.profile_image} onChange={handleChange} placeholder="https://image-link.com/photo.jpg" />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="A short description about yourself..." />
                        </div>

                        {message.text && (
                            <div style={{
                                ...styles.msgBox,
                                background: message.type === "success" ? "#EDF1D6" : "#FFECEC",
                                color: message.type === "success" ? "#40513B" : "#AE2E2E"
                            }}>
                                {message.text}
                            </div>
                        )}

                        <div style={styles.btnGroup}>
                            <button
                                type="button"
                                onClick={() => navigate(`/auth/profile/${userId}`)}
                                style={styles.cancelBtn}
                                className="btn-hover"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={styles.saveBtn}
                                className="btn-hover"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px'
    },
    container: { width: '100%', maxWidth: '600px' },
    formHeader: { background: '#ffffff', padding: '35px', textAlign: 'center' },
    title: { fontFamily: 'Cinzel', fontSize: '2rem', margin: 0, color: '#0b4f04', fontWeight: '500', letterSpacing: '1px' },
    bodyContent: { padding: '40px', background: '#FFFFFF' },
    inputGroup: { marginBottom: '22px' },
    label: { fontFamily: 'Cinzel', fontSize: '0.85rem', color: '#609966', fontWeight: '700', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' },
    btnGroup: { display: 'flex', gap: '15px', marginTop: '30px' },
    saveBtn: {
        flex: 2, padding: '16px', background: '#2c3828', color: '#EDF1D6',
        border: 'none', borderRadius: '14px', fontFamily: 'Inter', fontSize: '1rem', cursor: 'pointer', fontWeight: '600'
    },
    cancelBtn: {
        flex: 1, padding: '16px', background: 'transparent', color: '#609966',
        border: '2.5px solid #EDF1D6', borderRadius: '14px', fontFamily: 'Inter', fontSize: '1rem', cursor: 'pointer', fontWeight: '600'
    },
    msgBox: { marginBottom: '20px', padding: '14px', textAlign: 'center', fontFamily: 'Inter', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600' },
    loadingWrapper: { height: '100vh', background: '#2c3828', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default UpdateProfile;