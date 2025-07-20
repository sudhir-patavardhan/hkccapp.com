import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PatientList from './components/PatientList';
import Vaccine from './components/Vaccine';
import PatientDetails from './components/PatientDetails';
import VisitDetails from './components/VisitDetails';
import VisitReport from './components/VisitReport';
import DoctorAvailability from './components/DoctorAvailability';
import BookedAppointments from './components/BookedAppointments';

function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

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
    if (tab === 'list' || tab === 'details') setSelectedEntity(null);
    setSelectedTab(tab);
    setShowTiles(false);
  };

  const handleHomeClick = () => {
    setSelectedTab(null);
    setShowTiles(true);
  };

  const handleDetailsClick = () => {
    setSelectedTab('details');
    setShowTiles(false);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUserId('');
    setPassword('');
    setSelectedEntity(null);
  };

  const authenticateUser = async () => {
    console.log(userId);
    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        password: password,
      }),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    if (responseJson['statusCode'] === 200) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      alert('Authentication failed!');
      // Handle authentication failure (e.g., show an error message, prompt the user to try again, etc.)
    }
  };

  const renderLoginForm = () => {
    return (
      <div>
      <div className="login-form">
        <h2>Login</h2>
        <label htmlFor="user_id">User ID:</label>
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={authenticateUser}>Login</button>
        
      </div>
      <BookedAppointments />
      </div>
    );
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
      case 'doctorAvailability':
        return <div> <div><BookedAppointments /></div><div><DoctorAvailability /></div></div>;
      default:
        return null;
    }
  };

  const renderTiles = () => {
    return (
      <div className="tile-menu">
        <div className="tile" onClick={() => handleTabClick('list')}>
          <i className="fas fa-users tile-icon"></i>
          {' Search Patients'}
        </div>
        <div className="tile" onClick={() => handleTabClick('details')}>
          <i className="fas fa-user-plus tile-icon"></i>
          {'New Patient'}
        </div>
        <div className="tile" onClick={() => handleTabClick('visit')}>
          <i className="fas fa-door-open tile-icon"></i>
          {'Visit Details'}
        </div>
        <div className="tile" onClick={() => handleTabClick('vaccine')}>
          <i className="fas fa-syringe tile-icon"></i>
          {'Vaccine List'}
        </div>
        <div className="tile" onClick={() => handleTabClick('visitReport')}>
          <i className="fas fa-chart-bar tile-icon"></i>
          {'Report'}
        </div>
        <div className="tile" onClick={() => handleTabClick('doctorAvailability')}>
          <i className="fas fa-calendar-days tile-icon"></i>
          {'Doctor\'s Schedule'}
        </div>
        <div className="tileAlso"><BookedAppointments /></div>
        
      </div>
    )

  }

  return (
    <div className="app-container">
      <div className="content">
        <div className="content-header">
          <button className={`home-button ${showTiles ? 'hidden' : ''}`} onClick={handleHomeClick}>
            <i class="fas fa-clinic-medical"></i>
          </button>
          <button className={`details-button ${showTiles || !selectedEntity ? 'hidden' : ''}`} onClick={handleDetailsClick}>
            {selectedEntity && <i class="fas fa-hospital-user"></i>}
          </button>
          <span>Dr. Sheela's Clinic - HKCC</span>
          {authenticated && (
            <button className="logout-button" onClick={handleLogout}>
              <i class="fas fa-duotone fa-right-from-bracket"></i>
            </button>
          )}
        </div>
        {authenticated === false && renderLoginForm()}
        {authenticated === true && showTiles && renderTiles()}
        {authenticated === true && renderContent()}
      </div>
    </div>
  );
}

export default App;
