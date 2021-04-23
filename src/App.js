import { useEffect, useState } from 'react';
import './App.css';

import Speedometer from './speedometer/src';

function App() {

  const [values, setValues] = useState([]);

  async function callApi() {
    const response = await fetch('/api/slack-stoplight-responses');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }; 

  useEffect(() => {
    async function fetchData(){
      const body = await callApi();
      setValues(body.data);
    }
    fetchData()
  }, [])

  return (
    <div style={{ background: 'black', display: 'flex', justifyContent: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', height: '70%', alignItems: 'center' }}>
        <Speedometer values={values} />
      </div>
    </div>
  );
}

export default App;
