import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';

function drawTotpCircle() {
  const sec = new Date().getTime() / 1000;
  const fract = Math.ceil(sec % 30 * 10 / 3);
  document.querySelectorAll('.totp_circle').forEach(e=>{e.style.background  = `conic-gradient(red ${fract}%, grey 0)`})
}
setInterval(drawTotpCircle, 1000);

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
