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
  const [selectedTab, setSelectedTab] = useState('list');
  const handleTabClick = (tab) => {
    if (tab === 'list') setSelectedEntity(null);
    setSelectedTab(tab);
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (

    <div className="app-container">

      <div className="hamburger" onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </div>
      <div className={`sidebar${menuOpen ? ' open' : ''}`}>
        
          <h1>Dr Sheela's Clinic</h1>
          <h4>Visit</h4>
          <ul>
            <li>
              <button className={`tab-button ${selectedTab === 'list' ? 'active' : ''}`} onClick={() => handleTabClick('list')}>
                Search Patient
              </button>
            </li>
            <li>
              <button className={`tab-button ${selectedTab === 'details' ? 'active' : ''}`} onClick={() => handleTabClick('details')}>
                {selectedEntity ? 'Patient Details' : 'New Patient'}
              </button>
            </li>
            <li>
              <button className={`tab-button ${selectedTab === 'visit' ? 'active' : ''}`} onClick={() => handleTabClick('visit')}>
                Visit Details
              </button>
            </li>
          </ul>
          <h4>Data</h4>
          <ul>
            <li>
              <button className={`tab-button ${selectedTab === 'vaccine' ? 'active' : ''}`} onClick={() => handleTabClick('vaccine')}>
                Vaccines
              </button>
            </li>
            <li>
              <button className={`tab-button ${selectedTab === 'visitReport' ? 'active' : ''}`} onClick={() => handleTabClick('visitReport')}>
                Visit Report
              </button>
            </li>

          </ul>
        
      </div>
      <div className="content">
        <h3>
          {selectedEntity && (selectedTab === 'details' || selectedTab === 'visit') ? selectedEntity.patientName + ": " + selectedEntity.phone + " > " : ''}
        </h3>
        {selectedTab === 'list' ? <PatientList onItemClick={handleItemClick} /> : ''}
        {selectedTab === 'details' ? <PatientDetails selectedPatient={selectedEntity} onItemClick={handleItemClick} /> : ''}
        {selectedEntity && selectedTab === 'visit' ? <VisitDetails selectedPatient={selectedEntity} /> : selectedTab === 'visit' && 'Search or Add New Patient'}
        {selectedTab === 'vaccine' ? <Vaccine /> : ''}
        {selectedTab === 'visitReport' ? <VisitReport /> : ''}
      </div>
    </div>
  );
}

export default App;
