import React from 'react';
import './App.css';

const ResultsTable = ({ collaborations }) => {

  const collaborationsArray = Object.entries(collaborations)
    .map(([key, daysWorked]) => {
      const [emp1, emp2, projectID] = key.split('-');
      return { emp1, emp2, projectID, daysWorked };
    })
    .sort((a, b) => b.daysWorked - a.daysWorked);

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Employee ID #1</th>
          <th>Employee ID #2</th>
          <th>Project ID</th>
          <th>Days Worked</th>
        </tr>
      </thead>
      <tbody>
        {collaborationsArray.map(({ emp1, emp2, projectID, daysWorked }) => (
          <tr key={`${emp1}-${emp2}-${projectID}`}>
            <td>{emp1}</td>
            <td>{emp2}</td>
            <td>{projectID}</td>
            <td>{daysWorked}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;