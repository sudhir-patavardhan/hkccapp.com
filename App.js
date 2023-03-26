import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PatientList from './components/PatientList';
import Vaccine from './components/Vaccine';
import PatientDetails from './components/PatientDetails';
import VisitDetails from './components/VisitDetails';
import VisitReport from './components/VisitReport';

function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const handleItemClick = (entity) => {
    setSelectedEntity(entity);
    setSelectedTab('visit');
  };
  const showList = () => {
    setSelectedEntity(null);
  };
  const [selectedTab, setSelectedTab] = useState(null);
  const [showTiles, setShowTiles] = useState(true);
  const handleTabClick = (tab) => {
    if (tab === 'list') setSelectedEntity(null);
    setSelectedTab(tab);
    setShowTiles(false);
  };

  const handleHomeClick = () => {
    setSelectedTab(null);
    setShowTiles(true);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'list':
        return <PatientList onItemClick={handleItemClick} />;
      case 'details':
        return <PatientDetails selectedPatient={selectedEntity} onItemClick={handleItemClick} />;
      case 'visit':
        return selectedEntity ? <VisitDetails selectedPatient={selectedEntity} /> : 'Search or Add New Patient';
      case 'vaccine':
        return <Vaccine />;
      case 'visitReport':
        return <VisitReport />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="content">
      <div className="content-header">
          <button className={`home-button ${showTiles ? 'hidden' : ''}`} onClick={handleHomeClick}>
            Home
          </button>
          <span>Dr. Sheela's Clinic</span>
        </div>
        {renderContent()}
      
      {showTiles && (
        <div className="tile-menu">
          <div className="tile" onClick={() => handleTabClick('list')}>
            <h3>Search Patient</h3>
          </div>
          <div className="tile" onClick={() => handleTabClick('details')}>
            <h3>{selectedEntity ? 'Patient Details' : 'New Patient'}</h3>
          </div>
          <div className="tile" onClick={() => handleTabClick('visit')}>
            <h3>Visit Details</h3>
          </div>
          <div className="tile" onClick={() => handleTabClick('vaccine')}>
            <h3>Vaccines</h3>
          </div>
          <div className="tile" onClick={() => handleTabClick('visitReport')}>
            <h3>Visit Report</h3>
          </div>
        </div>
      )}
      </div>
       
    </div>
  );
}

export default App;