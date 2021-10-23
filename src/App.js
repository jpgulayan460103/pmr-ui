import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import ProcurementTable from './Components/ProcurementTable'
import ProcurementForm from './Components/ProcurementForm'

function App() {
  const [sampleData, setSampleData] = useState([]);
  return (
    <div className="App">
      <ProcurementForm sampleData={sampleData} setSampleData={setSampleData} />
      <ProcurementTable sampleData={sampleData} />

    </div>
  );
}

export default App;
