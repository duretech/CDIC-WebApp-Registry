import React, { useContext,useState, useEffect,useRef } from 'react';
import { getCookieConfig, getPrivacypolicyConfig, getUserconsentConfig,getTermsConfig } from '../../config/validationutils.js';
import Cookies from 'js-cookie';
import { Switch } from '@material-ui/core'; 
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess } from '@material-ui/icons'; 
import { CookieConsentContext } from '../../App.js'; // Adjust the import path as necessary

const CookieConsent = ({ onClose }) => {
    // Get the context value
  const { showCookieConsent, setShowCookieConsent } = useContext(CookieConsentContext);
  const [showConsent, setShowConsent] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false); 
  const [animateModal, setAnimateModal] = useState(false);
  const [pdfToShow, setPdfToShow] = useState(''); // New state to hold the PDF link
  const [showCookieModal, setShowCookieModal] = useState(false); 
  const [agreePrivacy, setAgreePrivacy] = useState(false); // State for privacy policy switch
  const [agreeConsent, setAgreeConsent] = useState(false); // State for user consent switch
  const [expandedSection, setExpandedSection] = useState(null);
  const sectionRefs = {
    cookies: useRef(null),
    privacy: useRef(null),
    consent: useRef(null),
  };

  useEffect(() => {
    const acceptedCookies = Cookies.get('cookiesAccepted');
    // if (!acceptedCookies) {
    //   setShowConsent(true);
    // }
    if (acceptedCookies !== 'true') {
      setShowConsent(true);
    } else {
      setShowConsent(false); 
    }
  }, []);

  const cookieConfig = getCookieConfig();
  const tittle = cookieConfig?.tittle || 'Cookie';
  const description = cookieConfig?.description || 'We use cookies to improve your experience on our site';
  const cookiepolicy = cookieConfig?.cookiepolicy || 'Cookie Policy';
  const cookieexpirydays = parseInt(cookieConfig?.cookieexpirydays) || 150;

  const privacypolicyConfig = getPrivacypolicyConfig();
  const ppversion = privacypolicyConfig?.version || "1.1";
  const ppdescription = privacypolicyConfig?.privacypolicy || "Privacy Policy";

  const userconsentConfig = getUserconsentConfig();
  const ucversion = userconsentConfig?.version || "1.1";
  const ucdescription = userconsentConfig?.userconsent || "User Consent";

  const termsofuseConfig = getTermsConfig();
  const touversion = termsofuseConfig?.version || "1.1";
  const toudescription = termsofuseConfig?.termsofuse || "Terms Of Use";

  // const handleAcceptCookies = () => {
  //   Cookies.set('cookiesAccepted', 'true', { expires: cookieexpirydays });
  //   setShowConsent(false);
  // };

  // const handleCancel = () => {
  //   Cookies.set('cookiesAccepted', 'false', { expires: cookieexpirydays });
  //   setShowConsent(false);
  // };

  if (!showCookieConsent) return null;

  const handleAcceptCookies = () => {
    // Set cookie with expiration (e.g., 30 days)
    Cookies.set('cookiesAccepted', 'true', { expires: 30 });
    
    // If you need to store individual consent types
    if (agreePrivacy) {
      Cookies.set('privacyPolicyAccepted', 'true', { expires: 30 });
    }
    if (agreeConsent) {
      Cookies.set('userConsentAccepted', 'true', { expires: 30 });
    }
    
    // Hide the consent dialog
    setShowCookieConsent(false);
  };
  
  // Modified handleCancel
  const handleCancel = () => {
    // Set cookiesAccepted to false when user declines
    Cookies.set('cookiesAccepted', 'false', { expires: 30 });
    
    // Hide the consent dialog
    setShowCookieConsent(false);
  };

  const handleOpenPdfModal = (pdfUrl) => {
    setPdfToShow(pdfUrl); // Set the URL of the PDF to display
    setShowPolicyModal(true); // Show the PDF modal
  };

  const handleClosePolicyModal = () => {
    setShowPolicyModal(false); // Close the PDF modal
  };

  const handleOverlayClick = () => {
    setAnimateModal(true);
    setTimeout(() => setAnimateModal(false), 1000); // Reset animation after 1 second
  };

  const handleOpenCookieModal = () => {
    setShowCookieModal(true); // Show the policy modal
  };

  const handleCloseCookieModal = () => {
    setShowCookieModal(false); // Close the policy modal
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null); // Collapse if the same section is clicked
    } else {
      setExpandedSection(section); // Expand the clicked section
    }
  };

  // const getHeight = (section) => {
  //   return expandedSection === section ? sectionRefs[section].current.scrollHeight : 0;
  // };
  const getHeight = (section) => {
    const ref = sectionRefs[section].current;
    // Ensure the ref exists before trying to access the scrollHeight
    return expandedSection === section && ref ? ref.scrollHeight : 0;
  };
  if (!showConsent) return null;

  const BlueDisabledSwitch = withStyles({
    switchBase: {
      color: '#5c6bc0', 
      '&.Mui-disabled': {
        color: '#5c6bc0', 
        opacity: 0.5,     
      },
      '&.Mui-checked.Mui-disabled': {
        color: '#5c6bc0', 
        opacity: 0.5,    
      },
    },
    checked: {},
    track: {
      backgroundColor: '#5c6bc0', 
      opacity: 0.5,  
    },
  })(Switch);

  return (
    <div>
      {/* Cookie Consent Dialog */}
      <div style={styles.overlay} onClick={handleOverlayClick}>
        <div  style={{
            ...styles.modal,
            animation: animateModal ? 'bounce 0.5s ease' : 'none',
          }} onClick={(e) => e.stopPropagation()}>
          <h2 style={styles.title}>{tittle}</h2>
          <p style={styles.description}>{description}
            </p>
            <div style={styles.collapsibleContainer}>
                 {/* Cookies Policy */}
            <div style={styles.collapsibleHeader} onClick={() => toggleSection('cookies')}>
              <span>Cookies Policy</span>
              {expandedSection === 'cookies' ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expandedSection === 'cookies' && (
             <div
             ref={sectionRefs.cookies}
             style={{ ...styles.collapsibleContentExpanded, maxHeight: expandedSection === 'cookies' ? '400px' : '0', transition: 'max-height 0.5s ease-in-out'}}
         >
             {/* <p>This is the content for Cookies Policy. You can describe your cookie usage here in more detail.</p> */}
             <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: cookiepolicy }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
         </div>
            )}

            {/* Privacy Policy */}
            <div style={styles.collapsibleHeader} onClick={() => toggleSection('privacy')}>
              <span>Privacy Policy</span>
              {expandedSection === 'privacy' ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expandedSection === 'privacy' && (
            <div
            ref={sectionRefs.privacy}
            style={{ ...styles.collapsibleContentExpanded, maxHeight: expandedSection === 'privacy' ? '400px' : '0', transition: 'max-height 0.5s ease-in-out' }}
          >
               <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: ppdescription }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
              </div>
            )}

            {/* User Consent */}
            <div style={styles.collapsibleHeader} onClick={() => toggleSection('consent')}>
              <span>User Consent</span>
              {expandedSection === 'consent' ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expandedSection === 'consent' && (
                 <div
                 ref={sectionRefs.consent}
                 style={{ ...styles.collapsibleContentExpanded, maxHeight: expandedSection === 'consent' ? '400px' : '0', transition: 'max-height 0.5s ease-in-out' }}
               >
                <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: ucdescription }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
              </div>
            )}

              {/* Terms of use*/}
              <div style={styles.collapsibleHeader} onClick={() => toggleSection('termsofuse')}>
              <span>Terms Of Use</span>
              {expandedSection === 'termsofuse' ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expandedSection === 'termsofuse' && (
                 <div
                 ref={sectionRefs.consent}
                 style={{ ...styles.collapsibleContentExpanded, maxHeight: expandedSection === 'termsofuse' ? '400px' : '0', transition: 'max-height 0.5s ease-in-out' }}
               >
                <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: toudescription }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
              </div>
            )}

          </div>
          
          {/* <ul style={styles.numberedList}>
            <li><a href="#!" onClick= {handleOpenCookieModal} style={styles.link}>Cookies Policy</a></li>
            <li><a href="#!" onClick={() => handleOpenPdfModal('https://eworldfulfillment.com/wp-content/uploads/2021/01/Privacy-Policy-Example-Template.pdf')} style={styles.link}>Privacy Policy</a></li>
            <li><a href="#!" onClick={() => handleOpenPdfModal('https://eworldfulfillment.com/wp-content/uploads/2021/01/Privacy-Policy-Example-Template.pdf')} style={styles.link}>User Consent</a></li>
          </ul> */}
          {/* <div style={styles.switchContainer}>
            <div style={styles.switchItem}>
              <Switch
                checked={agreePrivacy}
                onChange={() => setAgreePrivacy(!agreePrivacy)}
                color="primary"
              />
              <span>
                I agree to the{' '}
                <a
                  href="#!"
                  onClick={() => handleOpenPdfModal('https://example.com/privacy-policy.pdf')}
                  style={styles.link}
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            <div style={styles.switchItem}>
              <Switch
                checked={agreeConsent}
                onChange={() => setAgreeConsent(!agreeConsent)}
                color="primary"
              />
              <span>
                I agree to the{' '}
                <a
                  href="#!"
                  onClick={() => handleOpenPdfModal('https://example.com/user-consent.pdf')}
                  style={styles.link}
                >
                  User Consent
                </a>
              </span>
            </div>
          </div> */}

<div style={styles.switchContainer}>
<div style={styles.switchColumn}>
              {/* <Switch checked disabled color="primary" /> */}
              <BlueDisabledSwitch checked disabled />
              <p style={{ ...styles.switchLabel, opacity: 0.5 }}>
                Strictly necessary{' '}
                <a style={styles.switchTextLink}>
                Cookies
              </a>
              </p>
            </div>
            <div style={styles.separator}></div>
          {/* Privacy Policy Section */}
          <div style={styles.switchColumn}>
            <Switch
              checked={agreePrivacy}
              onChange={() => setAgreePrivacy(!agreePrivacy)}
              color="primary"
            />
            <p style={styles.switchLabel}>
              I agree to the{' '}
              <a style={styles.switchTextLink}>
                Privacy Policy
              </a>
            </p>
          </div>
          <div style={styles.separator}></div>
          {/* User Consent Section */}
          <div style={styles.switchColumn}>
            <Switch
              checked={agreeConsent}
              onChange={() => setAgreeConsent(!agreeConsent)}
              color="primary"
            />
            <p style={styles.switchLabel}>
              I agree to the{' '}
              <a style={styles.switchTextLink}>
                User Consent
              </a>
            </p>
          </div>
        </div>
          <div style={styles.buttonContainer}>
            <button style={styles.declineButton} onClick={handleCancel}>Decline All</button>
            <button style={styles.acceptButton} onClick={handleAcceptCookies}>Accept All</button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPolicyModal && (
        <div style={styles.overlay}>
          <div style={styles.pdfModal}>
            <iframe src={pdfToShow} style={styles.pdfIframe} title="PDF Viewer"></iframe>
            {/* Footer with Close Button */}
            <div style={styles.pdfFooter}>
              <button style={styles.closeButton} onClick={handleClosePolicyModal}>Back</button>
            </div>
          </div>
        </div>
      )}
         {showCookieModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>Cookie Policy</h4>
              <button style={styles.closeModalButton} onClick={handleCloseCookieModal}>
                &times;
              </button>
            </div>
       
            <div style={styles.modalBody} dangerouslySetInnerHTML={{ __html: cookiepolicy }}>
              {/* Dynamically bind the cookie policy content */}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.closeButton} onClick={handleCloseCookieModal}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '20px',
    textAlign: 'justify',
  },
  numberedList: {
    textAlign: 'left',
    listStyleType: 'decimal',
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  link: {
    color: '#001965',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'block',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#001965',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '48%',
  },
  declineButton: {
    backgroundColor: '#f86c6b',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '48%',
  },
  pdfModal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px',
    maxWidth: '1000px',
    width: '80%',
    height: '80%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  pdfIframe: {
    flexGrow: 1, // Take up remaining space
    width: '100%',
    height: '100%',
    border: 'none',
  },
  pdfFooter: {
    display: 'flex',
    justifyContent: 'center',
    // padding: '10px',
    marginTop: '10px',
    // borderTop: '1px solid #ddd',
  },
  closeButton: {
    backgroundColor: '#001965',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
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
    maxHeight: '70vh',
    overflowY: 'auto',
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
    textAlign: 'justify',
    overflowY: 'auto',
    maxHeight: '100%',
    borderRadius: '4px',
    padding: '10px',
   
  },
  collapsibleContentExpanded: {
    overflowY: 'auto', // Allow scroll if content exceeds maxHeight
    maxHeight: '300px', // Set a sensible limit for expanded content
    transition: 'max-height 0.5s ease-in-out',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  switchColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    marginTop: '10px',
    fontSize: '14px',
    textAlign: 'center',
  },
  collapsibleLink: {
    fontWeight: 'bold',
    color: '#001965',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginBottom: '10px',
  },
  // collapsibleContent: {
  //   backgroundColor: '#f0f0f0',
  //   padding: '10px',
  //   borderRadius: '4px',
  //   marginBottom: '10px',
  // },
  collapsibleContainer: {
    marginBottom: '20px',
  },
  collapsibleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#001965',
    color: '#fff',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  // collapsibleContent: {
  //   padding: '15px',
  //   backgroundColor: '#f1f1f1',
  //   borderRadius: '4px',
  //   marginBottom: '10px',
  //   transition: 'max-height 0.5s ease-in-out',
  // },
  // collapsibleContent: {
  //   overflow: 'hidden',
  //   backgroundColor: '#f1f1f1',
  //   borderRadius: '4px',
  //   marginBottom: '10px',
  //   padding: '0 15px',
  //   transition: 'max-height 0.5s ease-in-out',
  // },
    collapsibleContent: {
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
    marginBottom: '10px',
    padding: '0 15px',
    justifyContent: 'space-between',
    transition: 'max-height 0.5s ease-in-out',
    maxHeight: '0',  // default closed state
  },
  separator: {
    width: '1px',
    backgroundColor: '#e0e0e0',
    height: '100px',
    margin: '0 20px', // Space between the switches
  },
  switchTextLink: {
    color: '#001965', // Link color
    textDecoration: 'none', // Remove underline
    fontWeight: 'bold',
    transition: 'color 0.3s ease', // Add smooth color transition on hover
  },
  switchTextLinkHover: {
    color: '#001985', // Slightly darker color on hover
  },
};

export default CookieConsent;
