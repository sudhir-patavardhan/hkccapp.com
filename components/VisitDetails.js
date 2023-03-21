import React, { useState, useEffect } from 'react';
import AutocompleteTextbox from './AutocompleteTextbox';
import axios from 'axios';

function calcTotalVaccineCost(vaccines) {
  let total = 0;
  for (const vaccine of vaccines) {
    total = total + parseInt(vaccine.vaccineCost, 10); // Use parseInt for integer values
    // total = total + parseFloat(vaccine.vaccineCost); // Use parseFloat for decimal values
  }
  return total;
}

const VisitDetails = ({ selectedPatient }) => {
  const [isSaved, setIsSaved] = useState(false);

  const [phone, setPhone] = useState(selectedPatient.phone);
  const [patientName, setPatientName] = useState(selectedPatient.patientName);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [consultationFee, setConsultationFee] = useState(0);
  const [totalVaccineFee, setTotalVaccineFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);

  const [vaccines, setVaccines] = useState([{ phone: phone, patientName: patientName, givenDate: visitDate, vaccineName: '', vaccineCost: '', notes: '' }]);

  const [vaccineOptions, setVaccineOptions] = useState([]);

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

    fetchVaccines();
  }, []);
    
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
        setIsSaved(true);
                
      } catch (error) {
        console.error('Error saving visit details:', error);
      }
    };
    
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <th colspan="3">
                  {selectedPatient.patientName}, c/o {selectedPatient.parentName} ({selectedPatient.phone})
                </th>
              </tr>
              <tr>

                <td colSpan="2">
                  <label htmlFor="visitDate">Visit Date:</label>
                </td>
                <td>
                  <input
                    type="date"
                    id="visitDate"
                    value={visitDate || new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                </td>
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

