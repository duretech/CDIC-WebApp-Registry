import React, { useState, useEffect } from 'react';
import { getCookieConfig } from '../../config/validationutils.js';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false); 

  useEffect(() => {
    // Check if the user has already accepted cookies
    // const acceptedCookies = localStorage.getItem('cookiesAccepted');
    // if (!acceptedCookies) {
    //   // Show the consent dialog if cookies haven't been accepted
    //   setShowConsent(true);
    // }
    const acceptedCookies = Cookies.get('cookiesAccepted');
    if (!acceptedCookies) {
      setShowConsent(true);
    }
  }, []);

  const cookieConfig = getCookieConfig();
  const tittle = cookieConfig?.tittle || 'Cookie';
  const description = cookieConfig?.description || 'We use cookies to improve your experience on our site';
  const cookiepolicy = cookieConfig?.cookiepolicy || 'Cookie Policy';
  const cookieexpirydays = parseInt(cookieConfig?.cookieexpirydays) || 150;

  const handleAcceptCookies = () => {

    // localStorage.setItem('cookiesAccepted', 'true');
    // // Hide the consent dialog
    // setShowConsent(false);
    Cookies.set('cookiesAccepted', 'true', { expires: cookieexpirydays });
    setShowConsent(false);
  };

  const handleCancel = () => {
    // Dismiss the consent dialog without storing any consent
    setShowConsent(false);
  };

  const handleOpenPolicyModal = () => {
    setShowPolicyModal(true); // Show the policy modal
  };

  const handleClosePolicyModal = () => {
    setShowPolicyModal(false); // Close the policy modal
  };


  if (!showConsent) return null;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h4 style={styles.title}>{tittle}</h4>
          <button style={styles.closeButton} onClick={handleCancel}>
            &times;
          </button>
        </div>
        {/* <p style={styles.description}>
          We use cookies to improve your experience on our site. By accepting all cookies, you consent to our use of cookies.
        </p> */}
         <p style={styles.description}>
          {description}
                  </p>
                  <p style={styles.policy}>
          <a href="#!" onClick={handleOpenPolicyModal} style={styles.link}>Cookie Policy</a>
        </p>
        <div style={styles.buttonContainer}>
          <button className="loginbtn loginsubmitbtn mt-0" onClick={handleAcceptCookies}>
            Accept
          </button>
          <button className="resetButton w-50" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
           {/* Modal for Cookie Policy */}
           {showPolicyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>Cookie Policy</h4>
              <button style={styles.closeModalButton} onClick={handleClosePolicyModal}>
                &times;
              </button>
            </div>
       
            <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: cookiepolicy }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
            <div style={styles.modalFooter}>
              <button className="regformsubmitbtn mt-0" onClick={handleClosePolicyModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#fff',
    width: '300px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '20px',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  description: {
    margin: '10px 0 10px 0',
    textAlign: 'justify', // Justify the description text
  },
  policy: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  link: {
    color: '#007bff', // Highlight color (blue)
    textDecoration: 'underline', // Underline the link
    // fontWeight: 'bold', // Make it bold for emphasis
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    width: '45%', // Ensure both buttons are equal size
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    width: '45%', // Ensure both buttons are equal size
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  modalTitle: {
    margin: '0',
  },
  closeModalButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  modalBody: {
    overflowY: 'auto',
    maxHeight: '60vh',
    paddingRight: '10px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
};

export default CookieConsent;
