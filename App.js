import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import VisitDetails from './components/VisitDetails';

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
        if(tab === 'list') setSelectedEntity(null) ;
        setSelectedTab(tab);
    };
    
    return (
            <div>
                  <h1>Dr Sheela's Clinic</h1>
                  <div>
                    <button className={`tab-button ${selectedTab === 'list' ? 'active' : ''}`} onClick={() => handleTabClick('list')}>
                      Search
                    </button>
                    <button className={`tab-button ${selectedTab === 'details' ? 'active' : ''}`} onClick={() => handleTabClick('details')}>
                    {selectedEntity ? 'Patient Details' : 'New Patient'}
                    </button>
                    <button className={`tab-button ${selectedTab === 'visit' ? 'active' : ''}`} onClick={() => handleTabClick('visit')}>
                    Visit Details
                    </button>
                  </div>
                  <div className="tab-content">
                    {selectedTab === 'list' ? <PatientList onItemClick={handleItemClick} /> : '' }
            {selectedTab === 'details' ? <PatientDetails selectedPatient={selectedEntity} onItemClick={handleItemClick} />: '' }
                    {selectedEntity ? <VisitDetails selectedPatient={selectedEntity} />: '' }
                  </div>
                </div>
            );
}

export default App;
