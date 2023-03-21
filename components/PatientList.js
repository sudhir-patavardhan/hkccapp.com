    import React, { useState, useEffect } from 'react';
    import { calculateAge } from './utils';


    function PatientList({ onItemClick }) {
        const [entities, setEntities] = useState();
        const [phone, setPhone] = useState('');
        const [patientName, setPatientName] = useState('');
        const [parentName, setParentName] = useState('');
        const [searchStatus, setSearchStatus] = useState('');
        
        useEffect(() => {
            if (phone.length >= 3){
                setSearchStatus('Searching...');
                
                fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "phone": phone, "patientName": patientName, "parentName": parentName })
                })
                .then(response => response.json())
                .then(data => {
                    setEntities(JSON.parse(data));
                    setSearchStatus(`${JSON.parse(data).length} rows found`);
                })
                .catch(error => console.error(error));
            }}, [phone, patientName, parentName]);
        
        const handlePhoneChange = (event) => {
            setPhone(event.target.value);
        };
        
        const handlePatientNameChange = (event) => {
            setPatientName(event.target.value);
        };
        
        const handleParentNameChange = (event) => {
            setParentName(event.target.value);
        };
        

        
        return (
                <div>
                
                <form>
                <label>
                Search (Phone Number): &nbsp;
                <input type="text" value={phone} onChange={handlePhoneChange} />
                </label>
                </form>
                <b>&nbsp;{searchStatus}</b>
                <table>
                <thead>
                <tr>
                <th>Phone</th>
                <th>Patient Name</th>
                <th>Parent Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>DOB</th>
                </tr>
                </thead>
                <tbody>
                {entities && entities.map(entity => (
                    <tr key={`${entity.patientName}-${entity.phone}`} onClick={() => onItemClick(entity)}>
                    <td>{entity.phone}</td>
                    <td><b>{entity.patientName}</b></td>
                    <td>{entity.parentName}</td>
                    <td>{entity.gender}</td>
                    <td>{calculateAge(entity.dateOfBirth)}</td>
                    <td>{entity.dateOfBirth}</td>
                  </tr>
                ))}
                </tbody>
                </table>
                
                </div>
                );
    }

    export default PatientList;
