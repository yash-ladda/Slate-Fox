import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';

const Signup = ({ setGlobalUser }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'worker',
        bio: '',
    });

    useEffect(() => {
        document.body.style.overflow = "auto";
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/signup', formData);
            const userData = res.data.user || formData;
            setToken(res.data.access_token || '');
            setUser(userData);
            if (setGlobalUser) setGlobalUser(userData);
            setMessage('Account created! Redirecting...');
            const newUserId = userData.id;
            setTimeout(() => navigate(newUserId ? `/auth/profile/${newUserId}` : '/dashboard'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Signup failed');
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glow}></div>

            <div className="signup-card" style={styles.card}>
                <h1 style={styles.heading}>Create Account</h1>
                <p style={styles.subtext}>Join Slate Fox and get started</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="name" placeholder="Full Name" style={styles.input} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" style={styles.input} onChange={handleChange} required />

                    <div style={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            style={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <input name="phone" placeholder="Phone Number" style={styles.input} onChange={handleChange} required />

                    <div style={styles.selectWrapper}>
                        <select name="role" style={styles.select} onChange={handleChange}>
                            <option value="worker">Worker (Finding Gigs)</option>
                            <option value="recruiter">Recruiter (Posting Gigs)</option>
                        </select>
                        <span style={styles.arrow}>⌄</span>
                    </div>

                    <textarea
                        name="bio"
                        placeholder="Briefly describe your experience or company..."
                        style={styles.textarea}
                        onChange={handleChange}
                    />

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                {message && (
                    <div style={{
                        ...styles.message,
                        ...(message.includes('failed') ? styles.error : styles.success)
                    }}>
                        {message}
                    </div>
                )}

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Login</Link>
                </p>
            </div>

            <style>
                {`
                /* CARD HOVER EFFECT */
                .signup-card {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
                }

                .signup-card:hover {
                    transform: scale(1.02); /* Slight enlargement */
                    box-shadow: 0 30px 60px rgba(44, 56, 40, 0.12) !important;
                }

                /* INPUT FOCUS STATES */
                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border: 2px solid #609966 !important;
                    background: #ffffff !important;
                    box-shadow: 0 0 0 4px rgba(157, 192, 139, 0.2);
                }

                /* DROPDOWN STYLING */
                select option {
                    background-color: #F8FBF5;
                    color: #40513B;
                }

                /* BUTTON INTERACTIONS */
                button:hover {
                    filter: brightness(1.1);
                }

                button:active {
                    transform: translateY(1px);
                }
                `}
            </style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #F8FBF5 0%, #EDF1D6 100%)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },
    glow: {
        position: 'absolute',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(157,192,139,0.15), transparent)',
        filter: 'blur(100px)',
        zIndex: 0
    },
    card: {
        width: '100%',
        maxWidth: '540px',
        background: '#FFFFFF',
        borderRadius: '36px',
        padding: '50px',
        border: '2px solid #EDF1D6',
        boxShadow: '0 20px 40px rgba(44, 56, 40, 0.05)',
        zIndex: 1,
        textAlign: 'center'
    },
    heading: {
        fontFamily: 'Cinzel',
        fontSize: '34px',
        color: '#2c3828',
        margin: '0 0 8px 0',
        letterSpacing: '1px'
    },
    subtext: {
        color: '#609966',
        fontSize: '15px',
        marginBottom: '35px',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
    },
    input: {
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #EDF1D6',
        background: '#F8FBF5',
        fontSize: '15px',
        fontFamily: 'Inter',
        transition: 'all 0.2s ease',
        color: '#40513B'
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#EDF1D6',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        color: '#609966',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    textarea: {
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #EDF1D6',
        background: '#F8FBF5',
        fontSize: '15px',
        minHeight: '110px',
        fontFamily: 'Inter',
        resize: 'none'
    },
    selectWrapper: {
        position: 'relative'
    },
    select: {
        width: '100%',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #EDF1D6',
        background: '#F8FBF5',
        fontSize: '15px',
        appearance: 'none',
        cursor: 'pointer',
        color: '#40513B'
    },
    arrow: {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-55%)',
        color: '#609966',
        fontSize: '20px',
        pointerEvents: 'none'
    },
    button: {
        padding: '18px',
        borderRadius: '16px',
        background: '#609966',
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '10px',
        boxShadow: '0 10px 20px rgba(96, 153, 102, 0.2)'
    },
    footer: {
        marginTop: '30px',
        fontSize: '14px',
        color: '#40513B'
    },
    link: {
        color: '#609966',
        fontWeight: '700',
        textDecoration: 'none',
        marginLeft: '5px'
    },
    message: {
        marginTop: '20px',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600'
    },
    success: {
        background: '#EDF1D6',
        color: '#40513B',
        border: '1px solid #9DC08B'
    },
    error: {
        background: '#ffecec',
        color: '#AE2E2E',
        border: '1px solid #FEB2B2'
    }
};

export default Signup;