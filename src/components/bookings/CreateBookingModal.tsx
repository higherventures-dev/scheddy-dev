
import React from 'react';

const CreateBookingModal = ({ show, modalClosed, children, tabData }) => {
  return (
    <>
      {show && <div className="backdrop" onClick={modalClosed}></div>}
      <div className={`modal ${show ? 'show' : ''}`}>
        {/* Render your tab components here, passing tabData */}
        {children}
      </div>
    </>
  );
};

export default CreateBookingModal;
