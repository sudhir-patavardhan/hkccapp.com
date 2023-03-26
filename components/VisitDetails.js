import React, { useState, useEffect } from 'react';
import axios from 'axios';

function calcTotalVaccineCost(vaccines) {
  let total = 0;
  try {
    for (const vaccine of vaccines) {
      if (typeof vaccine.vaccineCost === 'string') {
        const parsedCost = parseInt(vaccine.vaccineCost, 10); // Use parseInt for integer values
        total = total + (isNaN(parsedCost) ? 0 : parsedCost);
        // total = total + parseFloat(vaccine.vaccineCost); // Use parseFloat for decimal values
      } else {
        throw new Error('Vaccine cost must be a string.');
      }
    }
  } catch (error) {
    console.error('An error occurred while calculating the total vaccine cost:', error);
    return null; // Return null or any other value to indicate that an error occurred
  }
  return total;
}


const VisitDetails = ({ selectedPatient }) => {
  const [visits, setVisits] = useState([]);

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState(selectedPatient.phone);
  const [patientName, setPatientName] = useState(selectedPatient.patientName);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [totalVaccineFee, setTotalVaccineFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);

  const [vaccines, setVaccines] = useState([{ phone: phone, patientName: patientName, givenDate: visitDate, vaccineName: '', vaccineCost: '', notes: '' }]);

  const [vaccineOptions, setVaccineOptions] = useState([]);


  const fetchVisits = async () => {

    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: selectedPatient.phone, patientName: selectedPatient.patientName, startDate: '01/01/2000', endDate: new Date() })
    });
    const data = await response.json();
    // alert(JSON.stringify(data));
    setVisits(JSON.parse(data));

  };


  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        const data = await response.json();
        setVaccineOptions(JSON.parse(data));
      } catch (error) {
        console.error(error);
      }
    };
    //alert('updating');
    fetchVaccines();
    fetchVisits();
  }, [selectedPatient]);

  function lookupJSON(jsonArray, lookupField, lookupValue, returnField) {
    const matchedItem = jsonArray.find(item => item[lookupField] === lookupValue);
    return matchedItem ? matchedItem[returnField] : null;
  }

  const handleVaccineNameChange = (index, e) => {
    const newVaccines = [...vaccines];
    newVaccines[index].vaccineName = e.target.value;
    newVaccines[index].vaccineCost = lookupJSON(vaccineOptions, 'vaccineName', e.target.value, 'sellingPrice');
    setVaccines(newVaccines);
    setTotalVaccineFee(calcTotalVaccineCost(vaccines));
    setTotalFee(consultationFee + calcTotalVaccineCost(vaccines));
    setIsSaved(false);

  };

  const handleVaccineCostChange = (index, e) => {
    const newVaccines = [...vaccines];
    newVaccines[index].vaccineCost = e.target.value;
    setVaccines(newVaccines);
    setTotalVaccineFee(calcTotalVaccineCost(vaccines));
    setTotalFee(consultationFee + calcTotalVaccineCost(vaccines));
    setIsSaved(false);
  };

  const handleAddVaccine = () => {
    setVaccines([...vaccines, { phone: phone, patientName: patientName, givenDate: visitDate, vaccineName: '', vaccineCost: '', notes: '' }]);
    setTotalVaccineFee(calcTotalVaccineCost(vaccines));
    setTotalFee(consultationFee + totalVaccineFee);
  };

  const handleRemoveVaccine = (index) => {
    const newVaccines = [...vaccines];
    newVaccines.splice(index, 1);
    setVaccines(newVaccines);
    setTotalVaccineFee(calcTotalVaccineCost(newVaccines));
    setTotalFee(consultationFee + calcTotalVaccineCost(newVaccines));
    setIsSaved(false);
  };

  const handleConsultationFeeChange = (e) => {
    setConsultationFee(Number(e.target.value));
    setTotalFee(Number(e.target.value) + calcTotalVaccineCost(vaccines));
    setIsSaved(false);
  };


  const insertVaccines = async () => {
    for (const vaccine of vaccines) {
      try {
        const response = await axios.put(
          'https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccinegiven',
          vaccine
        );
        console.log('001 Vaccine details added successfully!!!! ' + JSON.stringify(response.data));
        // clear form inputs after successful submission
        //setVaccines([{ manufacturer: '', vaccineName: '', vaccineCost: '' }]);
      } catch (error) {
        console.error(error);
        alert('Failed to add vaccine details. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const visitDetails = {
      phone,
      patientName,
      visitDate,
      reason,
      notes,
      paymentMode,
      consultationFee,
      totalVaccineFee,
      totalFee,
    };
    console.log(JSON.stringify(visitDetails));

    try {
      const response = await axios.put(
        'https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/visit',
        visitDetails
      );
      console.log('002 Visit details saved:', response.data);
      insertVaccines();
      fetchVisits();
      setIsSaved(true);
      setLoading(false);

    } catch (error) {
      console.error('Error saving visit details:', error);
    }
  };

  return (
    <div>


      <table>
        <thead>

          <tr>
            <th colSpan={3}>{visits ? visits.length : ''} Previous Visits {loading && <div className="spinner">Loading...</div>}</th>
          </tr>
          {visits.length > 0 ?
            <tr>
              <th>Date</th>
              <th>Fee Paid</th>
              <th>Vaccines Given</th>
            </tr>
            : ''}
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.visitDate}>
              <td>{visit.visitDate}</td>
              <td>{visit.totalFee}</td>
              <td>{visit.vaccineGiven}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <th colSpan="2">
                <label htmlFor="visitDate">New Visit on:</label>
              </th>
              <th>
                <input
                  type="date"
                  id="visitDate"
                  value={visitDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </th>
            </tr>
            <tr>
              <td colSpan="2">
                <label htmlFor="paymentMode">Payment Mode:</label>
              </td>
              <td>
                <div onChange={(e) => setPaymentMode(e.target.value)} id="paymentMode">
                  <input type="radio" value="Cash" name="paymentMode" /> Cash
                  <input type="radio" value="Paytm" name="paymentMode" /> Paytm
                  <input type="radio" value="UPI" name="paymentMode" /> UPI
                  <input type="radio" value="Card" name="paymentMode" /> Card
                  <input type="radio" value="Other" name="paymentMode" /> Other
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <label htmlFor="consultationFee">Consultation Fee:</label>
              </td>
              <td>
                <input
                  type="number"
                  id="consultationFee"
                  value={consultationFee}
                  onChange={(e) => handleConsultationFeeChange(e)}
                />
              </td>
            </tr>
            <tr>
              <th colSpan="2">Vaccine</th>
              <th>Vaccine Cost</th>
            </tr>
            {vaccines.map((vaccine, index) => (
              <tr key={index}>
                <td>
                  <button type="button" className="remove-vaccine" onClick={() => handleRemoveVaccine(index)}></button>
                </td>
                <td>
                  <select value={vaccine.vaccineName} onChange={(e) => handleVaccineNameChange(index, e)} >
                    <option key='' value=''></option>
                    {vaccineOptions.map((option) => (
                      <option key={option.vaccineName} value={option.vaccineName}>
                        {option.vaccineName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={vaccine.vaccineCost}
                    onChange={(e) => handleVaccineCostChange(index, e)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <button type="button" className="add-vaccine" onClick={handleAddVaccine}></button>
              </td>
              <td> Total Vaccine Cost:</td>
              <td>
                {totalVaccineFee}
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td> Total Payment: </td>
              <td>
                {totalFee}
              </td>
            </tr>
            <tr>
              <th colSpan="3">
                {loading && <div className="spinner">Loading...</div>}
                <button type="submit">Save</button>
                {isSaved ? ' Saved' : ''}

              </th>

            </tr>
          </tbody>
        </table>
      </form>

    </div>
  );

};

export default VisitDetails;

