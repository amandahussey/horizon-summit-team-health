import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import StopLight from './stoplight/src';

function App() {

  async function callApi() {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log('body', body)
    return body;
  }; 

  useEffect(() => {
    callApi()
  }, [])

  return (
    <StopLight />
  );
}

export default App;
