import React from 'react';
import '../../../src/styles/custom.css';

const TrialNotification = ({ daysLeft, onClose }) => {
  return (
    <div className="notification-bar d-flex">
      <marquee >
        *Attention: Your trial version expires in {daysLeft} days! Upgrade to the ECSCRM plan now to enjoy uninterrupted service and ensure continuous access to all our tools and support. Don’t delay secure your upgrade today!
      </marquee >
      <button className="btn upgradebutton">Upgrade Plan</button>
      <button className="close-button" onClick={onClose}>×</button>
    </div>
  );
};

export default TrialNotification;
