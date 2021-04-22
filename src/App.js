import { useEffect } from 'react';
import './App.css';

import StopLight from './stoplight/src';

function App() {

  async function callApi() {
    // const response = await fetch('/api/slack-stoplight-responses');
    const response = await fetch('/api/hello');
    console.log('response', response)
    const body = await response.json();
    console.log('body', body)
    if (response.status !== 200) throw Error(body.message);
    return body;
  }; 

  useEffect(() => {
    callApi()
  }, [])

  return (
    <div>hi</div>
    // <StopLight />
  );
}

export default App;
