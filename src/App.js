import React, { useState, useEffect } from 'react';
import ResultsTable from './ResultsTable';
import moment from 'moment';

function App() {
  const [file, setFile] = useState(null);
  const [collaborations, setCollaborations] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    const processData = async () => {
      if (file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const text = e.target.result;
            resolve(parseCSV(text));
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsText(file);
        });
      } else {
        return Promise.resolve(null);
      }
    };

    processData()
      .then((processedData) => {
        if (processedData) {
          setCollaborations(findLongestCollaboration(processedData));
        }
      })
      .catch((error) => {
        console.error("Error reading file:", error);
      });

    return () => { };
  }, [file]);

  const parseCSV = async (text) => {
    const lines = text.split('\n');
    const projects = {};

    for (const line of lines) {
      if (line) {
        const [empID, projectID, dateFrom, dateTo] = line.split(',');

        let startDate;
        try {
          startDate = moment(dateFrom, [
            "YYYY-MM-DD",
            "MM-DD-YYYY",
            "DD/MM/YYYY",
            "MMM D YYYY",
            "D MMM YYYY"
          ]).toDate();
        } catch (error) {
          console.warn("Error parsing date:", dateFrom, error);
          continue; 
        }

        const endDate = dateTo.trim() === 'NULL' ? new Date() : moment(dateTo, [
          "YYYY-MM-DD",
          "MM-DD-YYYY",
          "DD/MM/YYYY",
          "MMM D YYYY",
          "D MMM YYYY"
        ]).toDate();

        if (!projects[projectID]) {
          projects[projectID] = [];
        }
        projects[projectID].push({ empID, startDate, endDate });
      }
    }
    return projects;
  };

  const findLongestCollaboration = (projects) => {
    const collaborations = {};

    for (const projectID in projects) {
      const employees = projects[projectID];
      for (let i = 0; i < employees.length; i++) {
        for (let j = i + 1; j < employees.length; j++) {
          const emp1 = employees[i];
          const emp2 = employees[j];
          const start = Math.max(emp1.startDate, emp2.startDate);
          const end = Math.min(emp1.endDate, emp2.endDate);

          if (start <= end) {
            const daysWorked = Math.floor((end - start) / (1000 * 3600 * 24));
            const key = [emp1.empID, emp2.empID, projectID].join('-');
            collaborations[key] = (collaborations[key] || 0) + daysWorked;
          }
        }
      }
    }
    return collaborations;
  };

  return (
    <div className="App">
      <h1>Find Longest Working Employee Pairs</h1>
      <input type="file" id="fileInput" onChange={handleFileChange} />
      {Object.keys(collaborations).length > 0 && <ResultsTable collaborations={collaborations} />}
    </div>
  );
}

export default App;