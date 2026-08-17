import { useState } from 'react';

function ReportSystem() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const handleSend = () => {
        // Placeholder for email send logic
        alert('Report would be sent (functionality pending).');
    };

    return (
        <div className="h-auto bg-white shadow-sm rounded border my-4 p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h4 className="fw-bold mb-4">Generate Report</h4>
            <div className="mb-3">
                <label className="form-label">Recipient Email</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="e.g., manager@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Report subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Write your report here..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </div>
            <button
                type="button"
                className="btn text-white rounded-pill"
                style={{ background: 'linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)' }}
                onClick={handleSend}
                disabled={!email || !subject || !message}
            >
                Send Report
            </button>
        </div>
    );
}

export default ReportSystem;
