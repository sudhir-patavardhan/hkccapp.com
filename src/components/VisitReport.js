import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './VisitReport.module.css';


const VisitReport = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const [data, setData] = useState([]);
  const [phone, setPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [preset, setPreset] = useState('today');
  const [consultationFee, setConsultationFee] = useState(0);
  const [totalVaccineFee, setTotalVaccineFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);


  const fetchData = async () => {
    setLoading(true);
    console.log({ phone, patientName, startDate: (startDate), endDate: (endDate) });
    try {
      const response = await axios.post(
        'https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/visit',
        { phone, patientName, startDate: (startDate), endDate: (endDate) }
      );
      //console.log(JSON.stringify(response));
      setData(JSON.parse(response.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };


  useEffect(() => {
    fetchData();
  }, [startDate, endDate, preset]);

  useEffect(() => {
    const totalConsultationFee = data.reduce((sum, row) => sum + parseFloat(row.consultationFee), 0);
    const totalVaccineFees = data.reduce((sum, row) => sum + parseFloat(row.totalVaccineFee), 0);
    const grandTotalFee = data.reduce((sum, row) => sum + parseFloat(row.totalFee), 0);

    setConsultationFee(totalConsultationFee.toFixed(2));
    setTotalVaccineFee(totalVaccineFees.toFixed(2));
    setTotalFee(grandTotalFee.toFixed(2));
  }, [data]);

  function toLocalISOString(date) {
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 10);
    return localISOTime;
  }

  const handlePresetChange = (e) => {
    const value = e.target.value;
    setPreset(value);

    const now = new Date();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisMonthStart = toLocalISOString(new Date(now.getFullYear(), now.getMonth(), 1));
    const lastMonthStart = toLocalISOString(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const lastMonthEnd = toLocalISOString(new Date(now.getFullYear(), now.getMonth(), 0));
    const thisYearStart = toLocalISOString(new Date(now.getFullYear(), 0, 1));
    const lastYearStart = toLocalISOString(new Date(now.getFullYear() - 1, 0, 1));
    const lastYearEnd = toLocalISOString(new Date(now.getFullYear() - 1, 11, 31));

    switch (value) {
      case 'today':
        setStartDate(toLocalISOString(now));
        setEndDate(toLocalISOString(now));
        break;
      case 'yesterday':
        setStartDate(toLocalISOString(yesterday));
        setEndDate(toLocalISOString(yesterday));
        break;
      case 'thisMonth':
        setStartDate(thisMonthStart);
        setEndDate(toLocalISOString(now));
        break;
      case 'lastMonth':
        setStartDate(lastMonthStart);
        setEndDate(lastMonthEnd);
        break;
      case 'thisYear':
        setStartDate(thisYearStart);
        setEndDate(toLocalISOString(now));
        break;
      case 'lastYear':
        setStartDate(lastYearStart);
        setEndDate(lastYearEnd);
        break;
      default:
        break;
    }
  };

  const groupBySession = (data) => {
    return data.reduce((acc, row) => {
      if (!acc[row.sessionNumber]) {
        acc[row.sessionNumber] = [];
      }
      acc[row.sessionNumber].push(row);
      return acc;
    }, {});
  };

  const renderTable = (sessionData, sessionId) => {
    const totalConsultationFee = sessionData.reduce((sum, row) => sum + parseFloat(row.consultationFee), 0);
    const totalVaccineFees = sessionData.reduce((sum, row) => sum + parseFloat(row.totalVaccineFee), 0);
    const grandTotalFee = sessionData.reduce((sum, row) => sum + parseFloat(row.totalFee), 0);

    return (
      <p>
      <table key={sessionId}>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Phone #</th>
            <th>Patient</th>
            <th>Vaccines</th>
            <th>Consultation Fee</th>
            <th>Vaccine Cost</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sessionData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.visitDate}</td>
              <td>{row.phone}</td>
              <td>{row.patientName}</td>
              <td>{row.vaccineGiven}</td>
              <td>{row.consultationFee}</td>
              <td>{row.totalVaccineFee}</td>
              <td>{row.totalFee}</td>
            </tr>
          ))}
          <tr>
            <th colSpan={5}>Session {sessionId} Totals:</th>
            <th>{totalConsultationFee.toFixed(2)}</th>
            <th>{totalVaccineFees.toFixed(2)}</th>
            <th>{grandTotalFee.toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
      </p>
    );
  };

  const groupedData = groupBySession(data);

  // Calculate session-wise totals
  const sessionSummaries = Object.entries(groupedData).map(([sessionId, sessionData]) => {
    const totalConsultationFee = sessionData.reduce((sum, row) => sum + parseFloat(row.consultationFee), 0);
    const totalVaccineFees = sessionData.reduce((sum, row) => sum + parseFloat(row.totalVaccineFee), 0);
    const grandTotalFee = sessionData.reduce((sum, row) => sum + parseFloat(row.totalFee), 0);
    const numVisits = sessionData.length;
    return {
      sessionId,
      totalConsultationFee: totalConsultationFee,
      totalVaccineFees: totalVaccineFees,
      grandTotalFee: grandTotalFee,
      numVisits
    };
  });

  // Calculate grand totals for the summary table
  const grandTotals = sessionSummaries.reduce((acc, s) => {
    acc.numVisits += s.numVisits;
    acc.totalConsultationFee += s.totalConsultationFee;
    acc.totalVaccineFees += s.totalVaccineFees;
    acc.grandTotalFee += s.grandTotalFee;
    return acc;
  }, { numVisits: 0, totalConsultationFee: 0, totalVaccineFees: 0, grandTotalFee: 0 });

  // Calculate vaccine-wise totals
  const vaccineStats = {};
  data.forEach(row => {
    // row.vaccineGiven may be a comma-separated string of vaccine names
    // row.totalVaccineFee is the total charge for all vaccines in this visit
    if (row.vaccineGiven && row.totalVaccineFee) {
      const vaccines = row.vaccineGiven.split(',').map(v => v.trim()).filter(Boolean);
      const totalFee = parseFloat(row.totalVaccineFee) || 0;
      // If there are multiple vaccines, split the fee equally (best effort)
      const feePerVaccine = vaccines.length > 0 ? totalFee / vaccines.length : 0;
      vaccines.forEach(vaccineName => {
        if (!vaccineStats[vaccineName]) {
          vaccineStats[vaccineName] = { count: 0, totalCharge: 0 };
        }
        vaccineStats[vaccineName].count += 1;
        vaccineStats[vaccineName].totalCharge += feePerVaccine;
      });
    }
  });

  return (
    <div className={styles.reportContainer}>
      <h3 className={styles.title}>Visits Report</h3>
      {loading ? <div className={styles.loading}>Loading...</div> : ''}
      <form className={styles.filterForm}>
        <div className={styles.dateSelection}>
          <select name="preset" value={preset} onChange={handlePresetChange} className={styles.presetSelect}>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
          </select>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
          <span className={styles.toLabel}>to</span>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

      </form>

      {/* Session-wise totals summary as a table */}
      {sessionSummaries.length > 0 && (
        <div className={styles.card}>
          <h4 className={styles.sectionTitle}>Session-wise Totals</h4>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Session</th>
                <th>Visits</th>
                <th>Consultation Fee</th>
                <th>Vaccine Fee</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sessionSummaries.map(s => (
                <tr key={s.sessionId}>
                  <td><span className={styles.sessionBadge}>{s.sessionId}</span></td>
                  <td>{s.numVisits}</td>
                  <td className={styles.feeBlue}>{s.totalConsultationFee.toFixed(2)}</td>
                  <td className={styles.feeGreen}>{s.totalVaccineFees.toFixed(2)}</td>
                  <td className={styles.feeRed}>{s.grandTotalFee.toFixed(2)}</td>
                </tr>
              ))}
              <tr className={styles.grandTotalRow}>
                <td>Grand Total</td>
                <td>{grandTotals.numVisits}</td>
                <td className={styles.feeBlue}>{grandTotals.totalConsultationFee.toFixed(2)}</td>
                <td className={styles.feeGreen}>{grandTotals.totalVaccineFees.toFixed(2)}</td>
                <td className={styles.feeRed}>{grandTotals.grandTotalFee.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Vaccine-wise summary table */}
      {Object.keys(vaccineStats).length > 0 && (
        <div className={styles.card}>
          <h4 className={styles.sectionTitle}>Vaccine-wise Totals</h4>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Total Given</th>
                <th>Vaccine Charge</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(vaccineStats).map(([vaccine, stats], idx) => (
                <tr key={vaccine} className={idx % 2 === 0 ? styles.zebra : ''}>
                  <td>{vaccine}</td>
                  <td>{stats.count}</td>
                  <td className={styles.feeGreen}>{stats.totalCharge.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed session tables */}
      <div className={styles.sessionTables}>
        {Object.entries(groupedData).map(([sessionId, sessionData]) => (
          <div key={sessionId} className={styles.card}>
            <h4 className={styles.sectionTitle}>Session <span className={styles.sessionBadge}>{sessionId}</span> Details</h4>
            {renderTable(sessionData, sessionId)}
          </div>
        ))}
      </div>
    </div>
  );


};

export default VisitReport;
