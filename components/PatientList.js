import React, { useState, useEffect } from 'react';
import { calculateAge } from './utils';


function PatientList({ onItemClick }) {
    const [entities, setEntities] = useState();
    const [searchFor, setSearchFor] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    useEffect(() => {
        if (searchFor.length >= 3) {

            setSearchStatus('Searching...');

            fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "searchFor": searchFor })
            })
                .then(response => response.json())
                .then(data => {
                    setEntities(JSON.parse(data));
                    setSearchStatus(`${JSON.parse(data).length} rows found`);
                })
                .catch(error => console.error(error));
        }
    }, [searchFor]);

    const handleSearchFor = (event) => {
        setSearchFor(event.target.value);
    };


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th><input type="text" value={searchFor} onChange={handleSearchFor} /></th>
                        <th colSpan={4}>{searchStatus}</th>

                    </tr>
                    <tr>
                        <th>Phone</th>
                        <th>Patient Name</th>
                        <th>Parent Name</th>
                        <th>Gender</th>
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
                            <td>{entity.dateOfBirth}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default PatientList;
