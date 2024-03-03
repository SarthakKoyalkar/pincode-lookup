import React, { useState } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    postOffice: 'N/A',
    branchType: 'N/A',
    district: 'N/A',
    state: 'N/A',
  });

  const lookupPincode = () => {
    if (pincode.length !== 6) {
      alert('Please enter a valid 6-digit Pincode.');
      return;
    }

    setLoading(true);

    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false);

        if (data[0]?.Status === 'Error') {
          alert(`Error: ${data[0]?.Message}`);
          return;
        }

        const postOffice = data[0]?.PostOffice?.[0]?.Name || 'N/A';
        const branchType = data[0]?.PostOffice?.[0]?.BranchType || 'N/A';
        const district = data[0]?.PostOffice?.[0]?.District || 'N/A';
        const state = data[0]?.PostOffice?.[0]?.State || 'N/A';

        setResults({ postOffice, branchType, district, state });
      })
      .catch(error => {
        setLoading(false);
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <div className="App">
      <h1>Pincode Lookup</h1>
      <div>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter 6-digit Pincode"
          maxLength="6"
          required
        />
        <button onClick={lookupPincode}>Lookup</button>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && (
        <div id="results">
          <p><strong>Post Office Name:</strong> {results.postOffice}</p>
          <p><strong>Branch Type - Delivery Status:</strong> {results.branchType}</p>
          <p><strong>District:</strong> {results.district}</p>
          <p><strong>State:</strong> {results.state}</p>
        </div>
      )}
    </div>
  );
}

export default App;
