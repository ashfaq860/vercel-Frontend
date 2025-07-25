import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SupportWidget = () => {



    const [showOptions, setShowOptions] = useState(false);

  
  
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://embed.tawk.to/${process.env.REACT_APP_TAWK_ID}`; // Replace with your ID
        script.async = true;
      
        script.setAttribute('crossorigin', '*');
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script); // Clean up
        };
    }, []);

    return (
        <div style={{ position: "fixed", bottom: "26px", right: "90px", zIndex: 9999 }}>
            <div className="d-flex flex-column align-items-end">
                {showOptions && (
                    <div className="mb-2">
                        <a
                            href={`https://wa.me/${process.env.REACT_APP_PHONE}`}

                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success mb-2"
                        >
                            <i className="bi bi-whatsapp me-2"></i> WhatsApp
                        </a>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.Tawk_API?.maximize()}
                        >
                            <i className="bi bi-chat-dots me-2"></i> Live Chat
                        </button>
                    </div>
                )}
                <button className="btn btn-dark rounded-circle" onClick={() => setShowOptions(!showOptions)}>
                    <i className={`bi ${showOptions ? "bi-x-lg" : "bi-question-lg"}`}></i>
                </button>
            </div>
        </div>
    );
};

export default SupportWidget;
