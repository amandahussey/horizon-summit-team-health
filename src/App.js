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

  useEffect(async () => {
    const body = await callApi();
    setValues(body.data);
  }, [])

  return (
    <Speedometer values={values} />
  );
}

export default App;
