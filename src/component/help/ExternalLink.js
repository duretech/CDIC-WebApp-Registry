import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "react-bootstrap";

const ExternalLink = ({ url, redirectTo = "/layout/home" }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const isCordova = window.cordova !== undefined;
  const isPdf = url.toLowerCase().endsWith('.pdf');
  
  useEffect(() => {
    if (!navigator.onLine) {
      swal({
        title: t("This operation is not available while offline. Please go online to proceed."),
        icon: "warning",
        button: "OK",
      });
      history.push("/layout/home");
      return;
    }
    
    if (isCordova) {
      
      const target = window.cordova?.platformId == 'ios' ? '_blank' : '_system';
      const options = 'location=yes,hidden=no,zoom=yes';
    
      window.cordova.InAppBrowser.open(url, target, options);  
      history.replace(redirectTo);
    } else {
      window.open(url, "_blank");
      history.replace(redirectTo);
    }
  }, [url, history, redirectTo, t, isCordova]);

  const handleClose = () => {
    setShowModal(false);
    history.replace(redirectTo);
  };
  
  
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size="lg"
      aria-labelledby="help-modal-title"
      centered
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title id="help-modal-title">Help</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {showModal && (
          <iframe
            src={url}
            title="Content Viewer"
            width="100%"
            height="600"
            style={{ border: "none" }}
            allow="fullscreen"
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExternalLink;

