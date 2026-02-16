import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/crushview.css';

function CrushView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg) {
      setMessage(decodeURIComponent(msg));
    } else {
      setMessage('Operation completed.');
    }
  }, [searchParams]);

  return (
    <div className="crush-view">
      <div className="message-card">
        <h1>{message}</h1>
        <button type="button" onClick={() => navigate('/HomePage')} className="back-home-btn">
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CrushView;
