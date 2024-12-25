import { useEffect, useState } from 'react'
import sdk from '@stackblitz/sdk';
import { Button } from './components/ui/button';

function App() {
  useEffect(() => {
    const project = {
      files: {
        'index.html': '<div id="root"></div>',
        'index.js': `
          import React from 'react';
          import ReactDOM from 'react-dom';
          import App from './App';

          ReactDOM.render(<App />, document.getElementById('root'));
        `,
        'App.js': `
          import React from 'react';

          function App() {
            return <h1>Hello from StackBlitz!</h1>;
          }

          export default App;
        `,
        'package.json': JSON.stringify({
          dependencies: {
            react: '^17.0.2',
            'react-dom': '^17.0.2',
          },
        }),
      },
      title: 'React Project',
      description: 'A simple React project',
      template: 'create-react-app',
    };

    sdk.embedProject('embed-container', project);
  }, []);

  const onClickSave = async () => {
    const iframe: any = document.getElementById('embed-container');
    const vm = await sdk.connect(iframe);
    const files = await vm.getFsSnapshot();
    console.log(files);
    fetch('http://localhost:3000/api/assignments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files
      })
    })
  }

  return (
    <>
      <h1 className='text-3xl'>Neo App</h1>
      <div className='w-96 bg-gray-200' id="embed-container" style={{
        height: '500px',
        width: '100%'
      }}></div>
      <Button onClick={onClickSave}>Save</Button>
    </>
  )
}

export default App
