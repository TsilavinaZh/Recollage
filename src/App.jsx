import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import './style.css';
import logoReact from './assets/reactlogo.png'

function CollageCreator() {
    const [grid, setGrid] = useState('2x2');
    const [images, setImages] = useState(new Array(4).fill(null));
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleGridChange = (grid) => {
        setGrid(grid);
        setImages(new Array(grid === '2x2' ? 4 : grid === '2x1' ? 2 : 3).fill(null));
    };

    const loadImage = (event, index) => {
        const reader = new FileReader();
        reader.onload = () => {
            const newImages = [...images];
            newImages[index] = reader.result;
            setImages(newImages);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    const saveCollage = () => {
        if (images.some(image => image === null)) {
            showModal('Please add all photos before downloading.');
            return;
        }

        html2canvas(document.querySelector('#collage')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'Ecollagy.png';
            link.click();
        });
    };

    const removeAllPhotos = () => {
        handleGridChange('2x2'); // Reset to default grid of 2x2
    };

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div className="container">
            <h1>REC<img src={logoReact} width="20px" className="react-logo" style={{ border: '2px solid rgb(0, 0, 0)' }} />LLAGE</h1>
            <div className="collage-options">
                <button onClick={() => handleGridChange('2x1')} className={grid === '2x1' ? 'active' : ''}>2 Photos</button>
                <button onClick={() => handleGridChange('3x1')} className={grid === '3x1' ? 'active' : ''}>3 Photos</button>
                <button onClick={() => handleGridChange('2x2')} className={grid === '2x2' ? 'active' : ''}>4 Photos</button>
            </div>
            <div id="collage" className="collage" style={{ gridTemplateColumns: grid === '2x2' ? '1fr 1fr' : grid === '2x1' ? '1fr 1fr' : '1fr 1fr 1fr' }}>
                {images.map((image, index) => (
                    image ? <img key={index} src={image} alt={`Collage ${index + 1}`} /> :
                        <input key={index} type="file" accept="image/*" onChange={(event) => loadImage(event, index)} />
                ))}
            </div>
            <button id="save-btn" onClick={saveCollage}>Download</button>
            {/* <button className="remove-btn" onClick={removeAllPhotos}>Remove All</button> */}

            {/* Popup Modal */}
            {modalVisible && (
                <div id="popup-modal" className="modal-overlay show">
                    <div className="modal-content show">
                        <p id="popup-message">{modalMessage}</p>
                        <button onClick={closeModal} className="Alert">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollageCreator;