import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { getDateFromStr } from './utils';


function PatientDetails({ selectedPatient, onItemClick }) {


    //alert(selectedPatient.phone);
    const [phone, setPhone] = useState(selectedPatient ? selectedPatient.phone : '');
    const [patientName, setPatientName] = useState(selectedPatient ? selectedPatient.patientName : '');
    const [parentName, setParentName] = useState(selectedPatient ? selectedPatient.parentName : '');
    const [gender, setGender] = useState(selectedPatient ? selectedPatient.gender : '');
    const [dateOfBirth, setDateOfBirth] = useState(selectedPatient ? selectedPatient.dateOfBirth : '');
    const [age, setAge] = useState(null);
    const [isFetching, setIsFetching] = useState(false);



    useEffect(() => {
        if (selectedPatient && selectedPatient.dateOfBirth) {
            const birthDate = getDateFromStr(selectedPatient.dateOfBirth);
            const today = new Date();
            const ageCalc = today.getFullYear() - birthDate.getFullYear();
            const monthCalc = today.getMonth() - birthDate.getMonth();
            if (monthCalc < 0 || (monthCalc === 0 && today.getDate() < birthDate.getDate())) {
                setAge(ageCalc - 1);
            } else {
                setAge(ageCalc);
            }
        }
    }, [selectedPatient]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsFetching(true);


        let data = {
            phone: phone,
            patientName: patientName,
            parentName: parentName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            area: 'Bangalore'
        };

        if (selectedPatient)
            data = {
                phone: selectedPatient.phone,
                patientName: selectedPatient.patientName,
                parentName: selectedPatient.parentName,
                gender: selectedPatient.gender,
                dateOfBirth: selectedPatient.dateOfBirth,
                area: 'Bangalore'
            };
        selectedPatient = data;
        //alert(data.phone);

        fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/patient', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                setIsFetching(false)

                //selectedPatient =  JSON.parse(data)
                onItemClick(selectedPatient)
            })
            .catch(error => { setIsFetching(false) });

        setPhone('');
        setPatientName('');
        setParentName('');
        setGender('');
        setDateOfBirth(null);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
        if (selectedPatient) selectedPatient.phone = event.target.value;

    };

    const handlePatientNameChange = (event) => {
        setPatientName(event.target.value);
        if (selectedPatient) selectedPatient.patientName = event.target.value;

    };

    const handleParentNameChange = (event) => {
        setParentName(event.target.value);
        if (selectedPatient) selectedPatient.parentName = event.target.value;

    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
        if (selectedPatient) selectedPatient.gender = event.target.value;

    };

    const handleDateOfBirthChange = (event) => {
        setDateOfBirth(event.target.value);
        if (selectedPatient) selectedPatient.dateOfBirth = event.target.value;


    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label>Phone:</label>
                            </td>
                            <td>
                                <input type="text" value={selectedPatient && selectedPatient.phone} onChange={handlePhoneChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Patient Name:</label>
                            </td>
                            <td>
                                <input type="text" value={selectedPatient && selectedPatient.patientName} onChange={handlePatientNameChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Parent Name:</label>
                            </td>
                            <td>
                                <input type="text" value={selectedPatient && selectedPatient.parentName} onChange={handleParentNameChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Gender:</label>
                            </td>
                            <td>
                                <select value={selectedPatient && selectedPatient.gender} onChange={handleGenderChange}>
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Date of Birth:</label>
                            </td>
                            <td>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    value={selectedPatient && selectedPatient.dateOfBirth}
                                    onChange={handleDateOfBirthChange}
                                />

                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <button type="submit">{isFetching ? 'Saving...' : 'Save'}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </form>


        </div>
    );
}

export default PatientDetails;

