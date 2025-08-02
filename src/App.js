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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faHospitalUser, faRightFromBracket, faUsers, faUserPlus, faDoorOpen, faSyringe, faChartBar, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState(null);
  const [showTiles, setShowTiles] = useState(true);

  const handleItemClick = (entity) => {
    setSelectedEntity(entity);
    setSelectedTab('visit');
  };
  const showList = () => {
    setSelectedEntity(null);
  };
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
    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: userId, password: password }),
    });
    const responseJson = await response.json();
    if (responseJson['statusCode'] === 200) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      alert('Authentication failed!');
    }
  };

  const renderLoginForm = () => (
    <div className="login-form-card">
      <div className="login-form-modern">
        <h2>Login</h2>
        <label htmlFor="user_id">User ID:</label>
        <input type="text" id="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary-btn" onClick={authenticateUser}>Login</button>
      </div>
      <div className="login-appointments-preview">
        <BookedAppointments authenticated={authenticated} />
      </div>
      </div>
    );

  const renderContent = () => {
    switch (selectedTab) {
      case 'list':
        return <PatientList onItemClick={handleItemClick} />;
      case 'details':
        return <PatientDetails selectedPatient={selectedEntity} onItemClick={handleItemClick} />;
      case 'visit':
        return selectedEntity ? <VisitDetails selectedPatient={selectedEntity} /> : <div className="empty-state">Search or Add New Patient</div>;
      case 'vaccine':
        return <Vaccine />;
      case 'visitReport':
        return <VisitReport />;
      case 'doctorAvailability':
        return <div className="doctor-availability-flex"><BookedAppointments authenticated={authenticated} /><DoctorAvailability /></div>;
      default:
        return null;
    }
  };

  const renderTiles = () => (
    <div className="tile-menu-flex">
      <div className="tile-flex" onClick={() => handleTabClick('list')}>
        <FontAwesomeIcon icon={faUsers} className="tile-icon-flex" />
        <span>Search Patients</span>
        </div>
      <div className="tile-flex" onClick={() => handleTabClick('details')}>
        <FontAwesomeIcon icon={faUserPlus} className="tile-icon-flex" />
        <span>New Patient</span>
        </div>
      <div className="tile-flex" onClick={() => handleTabClick('visit')}>
        <FontAwesomeIcon icon={faDoorOpen} className="tile-icon-flex" />
        <span>Visit Details</span>
        </div>
      <div className="tile-flex" onClick={() => handleTabClick('vaccine')}>
        <FontAwesomeIcon icon={faSyringe} className="tile-icon-flex" />
        <span>Vaccine List</span>
        </div>
      <div className="tile-flex" onClick={() => handleTabClick('visitReport')}>
        <FontAwesomeIcon icon={faChartBar} className="tile-icon-flex" />
        <span>Report</span>
        </div>
      <div className="tile-flex" onClick={() => handleTabClick('doctorAvailability')}>
        <FontAwesomeIcon icon={faCalendarDays} className="tile-icon-flex" />
        <span>Doctor's Schedule</span>
      </div>
      <div className="tileAlso-flex"><BookedAppointments authenticated={authenticated} /></div>
    </div>
  );

  return (
    <div className="app-container-flex">
      <div className="content-flex">
        <div className="content-header-flex">
          <button className={`home-button-flex ${showTiles ? 'hidden' : ''}`} onClick={handleHomeClick}>
            <FontAwesomeIcon icon={faClinicMedical} />
          </button>
          <button className={`details-button-flex ${showTiles || !selectedEntity ? 'hidden' : ''}`} onClick={handleDetailsClick}>
            {selectedEntity && <FontAwesomeIcon icon={faHospitalUser} />}
          </button>
          <span className="header-title-flex">Dr. Sheela's Clinic - HKCC</span>
          {authenticated && (
            <button className="logout-button-flex" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          )}
        </div>
        {!authenticated && renderLoginForm()}
        {authenticated && showTiles && renderTiles()}
        {authenticated && renderContent()}
      </div>
    </div>
  );
}

export default App;
