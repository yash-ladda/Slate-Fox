import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkStyle = ({ isActive }) => ({
        ...styles.link,
        color: isActive ? '#609966' : '#475569',
        fontWeight: isActive ? '700' : '500',
    });

    return (
        <nav style={{
            ...styles.navbar,
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'white',
            backdropFilter: 'blur(12px)',
            boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.08)' : 'none'
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700&display=swap');
                
                .nav-link-item {
                    position: relative;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                .nav-link-item:hover {
                    background: #F8FBF5;
                    color: #609966 !important;
                }
                .active-indicator {
                    position: absolute;
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background: #609966;
                    border-radius: 50%;
                }
                .logout-btn-hover:hover {
                    background: #fee2e2 !important;
                    transform: translateY(-1px);
                }
                `}
            </style>

            <div style={styles.navContainer}>
                {/* --- LOGO --- */}
                <Link to="/" style={styles.logoContainer} onClick={closeMenu}>
                    <div style={styles.logoCircle}>🦊</div>
                    <span style={styles.logoText}>SLATE FOX</span>
                </Link>

                {/* --- CENTER NAVIGATION (LOGIC BASED) --- */}
                <div style={styles.desktopNav}>
                    {user && (
                        <>
                            <NavLink to="/dashboard" style={navLinkStyle} className="nav-link-item">
                                {({ isActive }) => (
                                    <>Dashboard {isActive && <div className="active-indicator" />}</>
                                )}
                            </NavLink>

                            {/* RECRUITER ONLY */}
                            {user.role === 'recruiter' && (
                                <>
                                    <NavLink to="/create-job" style={navLinkStyle} className="nav-link-item">
                                        {({ isActive }) => (
                                            <>Post Job {isActive && <div className="active-indicator" />}</>
                                        )}
                                    </NavLink>
                                    <NavLink to="/my-jobs" style={navLinkStyle} className="nav-link-item">
                                        {({ isActive }) => (
                                            <>My Postings {isActive && <div className="active-indicator" />}</>
                                        )}
                                    </NavLink>
                                </>
                            )}

                            {/* WORKER ONLY */}
                            {user.role === 'worker' && (
                                <>
                                    <NavLink to="/jobs" style={navLinkStyle} className="nav-link-item">
                                        {({ isActive }) => (
                                            <>Find Jobs {isActive && <div className="active-indicator" />}</>
                                        )}
                                    </NavLink>
                                    <NavLink to="/my-applications" style={navLinkStyle} className="nav-link-item">
                                        {({ isActive }) => (
                                            <>Applications {isActive && <div className="active-indicator" />}</>
                                        )}
                                    </NavLink>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* --- RIGHT AUTH SECTION --- */}
                <div style={styles.rightNav}>
                    {user ? (
                        <div style={styles.userSection}>
                            <Link to={`/auth/profile/${user.id}`} style={styles.profileBox} onClick={closeMenu}>
                                <img
                                    src={user.profile_image || `https://ui-avatars.com/api/?name=${user.name}&background=609966&color=fff`}
                                    style={styles.avatar}
                                    alt="profile"
                                />
                                <div style={styles.userInfo}>
                                    <span style={styles.userName}>{(user?.name || "User").split(' ')[0]}</span>
                                    <span style={styles.userBadge}>{user.role}</span>
                                </div>
                            </Link>
                            <button onClick={onLogout} style={styles.logoutBtn} className="logout-btn-hover">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={styles.guestGroup}>
                            <Link to="/login" style={styles.loginBtn}>Login</Link>
                            <Link to="/auth/signup" style={styles.signupBtn}>Sign Up</Link>
                        </div>
                    )}
                </div>

                <button style={styles.mobileMenuIcon} onClick={toggleMenu}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        position: 'sticky', top: 0, zIndex: 1000,
        height: '80px', display: 'flex', alignItems: 'center',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.3s ease',
    },
    navContainer: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
    logoCircle: { width: '40px', height: '40px', background: '#2c3828', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
    logoText: { fontFamily: 'Cinzel', fontSize: '20px', fontWeight: '700', color: '#2c3828', letterSpacing: '1px' },
    desktopNav: { display: 'flex', gap: '10px' },
    link: { fontSize: '14px', color: '#475569', transition: 'all 0.2s' },
    rightNav: { display: 'flex', alignItems: 'center' },
    userSection: { display: 'flex', alignItems: 'center', gap: '15px', background: '#f1f5f9', padding: '6px 6px 6px 12px', borderRadius: '50px' },
    profileBox: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', background: '#ddd' },
    userInfo: { display: 'flex', flexDirection: 'column' },
    userName: { fontSize: '13px', fontWeight: '700', color: '#1e293b' },
    userBadge: { fontSize: '9px', color: '#609966', fontWeight: '800', textTransform: 'uppercase' },
    logoutBtn: { padding: '8px 16px', background: 'white', color: '#ef4444', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: '0.2s' },
    guestGroup: { display: 'flex', gap: '10px' },
    loginBtn: { textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '14px', padding: '10px 15px' },
    signupBtn: { textDecoration: 'none', background: '#2c3828', color: 'white', fontWeight: '600', fontSize: '14px', padding: '10px 20px', borderRadius: '10px' },
    mobileMenuIcon: { display: 'none', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#2c3828' }
};

export default Navbar;