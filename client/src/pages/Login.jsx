import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';

const Login = ({ setGlobalUser }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "auto";
    }, []);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            setToken(response.data.access_token);
            setUser(response.data.user);

            if (setGlobalUser) {
                setGlobalUser(response.data.user);
            }

            setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1200);

        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Login failed. Please check your credentials.',
                type: 'error'
            });
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glow}></div>

            <div style={styles.card} className="login-card">
                <h1 style={styles.heading}>Welcome Back</h1>
                <p style={styles.subtext}>Login to continue to Slate Fox</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit({
                            email: e.target.email.value,
                            password: e.target.password.value
                        });
                    }}
                    style={styles.form}
                >
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        style={styles.input}
                    />

                    <div style={styles.passwordWrapper}>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
                        />
                        <button
                            type="button"
                            style={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                {message.text && (
                    <div style={{
                        ...styles.message,
                        ...(message.type === 'error' ? styles.error : styles.success)
                    }}>
                        {message.text}
                    </div>
                )}

                <p style={styles.footer}>
                    Don’t have an account?{' '}
                    <Link to="/signup" style={styles.link}>Sign up</Link>
                </p>
            </div>

            <style>
                {`
                /* CARD HOVER EFFECT - MATCHING SIGNUP */
                .login-card {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
                    animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .login-card:hover {
                    transform: scale(1.02);
                    box-shadow: 0 30px 60px rgba(44, 56, 40, 0.12) !important;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* INPUT FOCUS STATES */
                input:focus {
                    outline: none;
                    border: 2px solid #609966 !important;
                    background: #ffffff !important;
                    box-shadow: 0 0 0 4px rgba(157, 192, 139, 0.2);
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
        maxWidth: '520px',
        background: '#FFFFFF',
        borderRadius: '36px',
        padding: '60px 50px',
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
        gap: '20px'
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

export default Login;