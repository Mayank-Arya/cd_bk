import React, { useState } from 'react';
import './App.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai'; // Choose your preferred theme

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(''); // State to store the selected language
  const [code, setCode] = useState(''); // State to store user's code
  const [output, setOutput] = useState(''); // State to store the converted/debugged code

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleConvert = () => {
    // Check if a language is selected
    if (!selectedLanguage || selectedLanguage === 'Select Language') {
      // Handle the case where no language is selected
      console.error('Please select a language.');
      return;
    }
  
    // Make an API call to your backend for code conversion
    fetch('http://localhost:9090/code/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, lang: selectedLanguage }), // Pass the selected language
    })
      .then((res) => res.json())
      .then((data) => {
        setOutput(data.code);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const handleDebug = () => {
    fetch('http://localhost:9090/code/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.code); // Set the debugged code in the output
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleCheckCode = () => {
    // Make an API call to your backend for code checking
    // Replace 'YOUR_BACKEND_URL' with the actual URL of your backend API
    fetch('http://localhost:9090/code/quality-checker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code}),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.report); // Set the code checking report in the output
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="App">
      <div className="navbar">
        <select className="language-select" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option>Select Language</option>
          <option value='JavaScript'>JavaScript</option>
          <option value='Python'>Python</option>
          <option value='C++'>C++</option>
          <option value='Java'>Java</option>
        </select>
        <button className="convert-button" onClick={handleConvert}>
          Convert Code
        </button>
        <button className="debug-button" onClick={handleDebug}>
          Debug
        </button>
        <button className="check-button" onClick={handleCheckCode}>
          Check Code
        </button>
      </div>
      <div className="code-container">
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={handleCodeChange}
          value={code}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
        />
        <div className="code-output">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
