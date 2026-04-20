const ApplicationList = ({ applications, onUpdate }) => {
    console.log(applications);
    
    return (
        <div className="applications">
            <h3>Applications</h3>
            {applications.map((app) => (
                <div key={app.id} className="application">
                    <p>{app.worker_id} - {app.status}</p>
                    {onUpdate && (
                        <div>
                            <button onClick={() => onUpdate(app.id, 'accepted')}>Accept</button>
                            <button onClick={() => onUpdate(app.id, 'rejected')}>Reject</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ApplicationList;
