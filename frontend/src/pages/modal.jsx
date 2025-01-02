import React, { useState } from 'react';
import '../css/modal.css';

import Listen from '../images/listen.png';
import Record from '../images/record.png';
import check from '../images/check.png';


function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>

                <div className="waveform-container">
                    {/* 파형 이미지나 애니메이션이 들어갈 자리 */}
                    <div className="waveform"></div>
                </div>
                {/* ==================================================================================================== */}
                <div className='modal-btn-container'>
                    <button className='record-btn'>
                        <img src={Record} alt="record" className='modal-btn' />
                    </button>
                    
                    <button className='listen-btn'>
                        <img src={Listen} alt="listen" className='modal-btn' />
                    </button>

                    <button className='check-btn' onClick={nextModal}>
                        <img src={check} alt="check" className='modal-btn' />
                    </button>
                </div>
            </div>
        </div>
    );
}

function nextModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
        </div>
    );
}

export default Modal;