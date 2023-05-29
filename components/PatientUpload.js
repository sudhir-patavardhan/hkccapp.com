import React, { useState } from 'react';
import axios from 'axios';

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

const PatientUpload = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseCSV = async (file) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');

    const patients = lines.slice(1).map((line) => {
      const patientData = line.split(',');
      const patient = {
        patientName : patientData[0] ? patientData[0].replace(/\./g, '') : '',
        phone : patientData[1] ? patientData[1].replace(/\s+/g, '') : '',
        parentName : '',
        dateOfBirth : '',
        gender : '',
        area : 'Bangalore'
      };


      console.log(JSON.stringify(patientData));

      headers.forEach((header, index) => {
        patient[header] = patientData[index];
      });
      console.log(patient);
      return patient;
      
    });

    return patients;
  };

  const onUpload = async () => {
    if (!file) {
      alert('Please select a CSV file');
      return;
    }
  
    const patients = await parseCSV(file);
    const delay = 100; // Adjust the delay in milliseconds as needed
  
    for (const patient of patients) {
      try {
        await axios.put('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/patient', patient);
        console.log('Patient inserted:', patient);
        await sleep(delay);
      } catch (error) {
        console.error('Error inserting patient:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={onFileChange} />
      <button onClick={onUpload}>Upload CSV</button>
    </div>
  );
};

export default PatientUpload;
