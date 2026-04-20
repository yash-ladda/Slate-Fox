import { useState } from 'react';

const JobForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        scheduled_at: '',
        ends_at: '',
        capacity: '',
        max_applications: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (new Date(formData.ends_at) <= new Date(formData.scheduled_at)) {
                throw new Error("End time must be after start time");
            }

            const payload = {
                ...formData,
                salary: Number(formData.salary),
                capacity: Number(formData.capacity),
                max_applications: formData.max_applications
                    ? Number(formData.max_applications)
                    : null,
                scheduled_at: formData.scheduled_at + ":00",
                ends_at: formData.ends_at + ":00",
            };

            await onSubmit(payload);
            setSuccess("Job created successfully ✅");
            setFormData({
                title: '', description: '', location: '', salary: '',
                scheduled_at: '', ends_at: '', capacity: '', max_applications: ''
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');

                .form-container {
                    animation: zoomInScale 0.7s cubic-bezier(0.19, 1, 0.22, 1);
                }

                @keyframes zoomInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: #609966 !important;
                    background: #FFFFFF !important;
                    box-shadow: 0 0 0 4px rgba(157, 192, 139, 0.2);
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 10px 20px rgba(96, 153, 102, 0.3);
                }
                `}
            </style>

            <div style={styles.container} className="form-container">
                <h2 style={styles.heading}>Create New Job</h2>
                <p style={styles.subHeading}>Fill in the details to post a job on Slate Fox</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Job Title</label>
                        <input
                            style={styles.input}
                            name="title"
                            placeholder="e.g. Senior Delivery Partner"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            style={styles.textarea}
                            name="description"
                            placeholder="Describe the roles and responsibilities..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Location</label>
                        <input
                            style={styles.input}
                            name="location"
                            placeholder="e.g. Pune, Maharashtra"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Salary (₹)</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                min={0}
                                required
                            />
                        </div>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Worker Capacity</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>Start Time</label>
                            <input
                                style={styles.input}
                                type="datetime-local"
                                name="scheduled_at"
                                value={formData.scheduled_at}
                                onChange={handleChange}
                                min={getCurrentDateTime()}
                                required
                            />
                        </div>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label style={styles.label}>End Time</label>
                            <input
                                style={styles.input}
                                type="datetime-local"
                                name="ends_at"
                                value={formData.ends_at}
                                onChange={handleChange}
                                min={formData.scheduled_at || getCurrentDateTime()}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Max Applications (Optional)</label>
                        <input
                            style={styles.input}
                            type="number"
                            name="max_applications"
                            value={formData.max_applications}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                        style={loading ? styles.buttonDisabled : styles.button}
                    >
                        {loading ? 'Creating Gig...' : 'Create Job Posting'}
                    </button>

                    {error && <div style={styles.errorBox}>{error}</div>}
                    {success && <div style={styles.successBox}>{success}</div>}
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3828 0%, #40513B 100%)',
        padding: '60px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: '650px',
        background: '#FFFFFF',
        padding: '50px',
        borderRadius: '36px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
    },
    heading: {
        fontFamily: 'Cinzel',
        fontSize: '2.2rem',
        color: '#2c3828',
        margin: '0 0 10px 0',
        textAlign: 'center'
    },
    subHeading: {
        fontFamily: 'Inter',
        color: '#609966',
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '0.95rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    row: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
    },
    label: {
        fontFamily: 'Cinzel',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#40513B',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    input: {
        padding: '14px 18px',
        borderRadius: '14px',
        border: '1px solid #EDF1D6',
        background: '#F8FBF5',
        fontFamily: 'Inter',
        fontSize: '0.95rem',
        color: '#2c3828',
        transition: 'all 0.2s ease'
    },
    textarea: {
        padding: '14px 18px',
        borderRadius: '14px',
        border: '1px solid #EDF1D6',
        background: '#F8FBF5',
        fontFamily: 'Inter',
        fontSize: '0.95rem',
        minHeight: '100px',
        resize: 'vertical',
        transition: 'all 0.2s ease'
    },
    button: {
        marginTop: '20px',
        padding: '18px',
        background: '#609966',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        fontFamily: 'Cinzel',
        fontWeight: '700',
        fontSize: '1rem',
        letterSpacing: '1.5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    buttonDisabled: {
        marginTop: '20px',
        padding: '18px',
        background: '#9DC08B',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        fontFamily: 'Cinzel',
        fontWeight: '700',
        cursor: 'not-allowed',
        opacity: 0.7
    },
    errorBox: {
        background: '#FFECEC',
        color: '#AE2E2E',
        padding: '15px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontFamily: 'Inter',
        fontWeight: '600',
        textAlign: 'center'
    },
    successBox: {
        background: '#EDF1D6',
        color: '#40513B',
        padding: '15px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontFamily: 'Inter',
        fontWeight: '600',
        textAlign: 'center',
        border: '1px solid #9DC08B'
    }
};

export default JobForm;