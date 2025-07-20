import React, { useState, useEffect } from 'react';
import { getAgeString } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


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
        <div className="list">
            <div className="list-header">
                <div className="search-container">
                    <FontAwesomeIcon className="search-icon" icon={faSearch} />
                  <input
                        type="text"
                        value={searchFor}
                        onChange={handleSearchFor}
                        className="search-input"
                    />
                    
                </div>
                <span>{searchStatus}</span>
            </div>
            {entities &&
                entities.map((entity) => (
                    <div
                        key={`${entity.patientName}-${entity.phone}`}
                        className="item"
                        onClick={() => onItemClick(entity)}
                    >
                        <span>{entity.phone}</span>
                        <span>
                            <b>{entity.patientName}</b>
                        </span>
                        <span>{entity.parentName}</span>
                        <span>{entity.gender}</span>
                        <span>{entity.dateOfBirth} : {getAgeString(entity.dateOfBirth)}</span>
                    </div>
                ))}
        </div>
    );
}

export default PatientList;