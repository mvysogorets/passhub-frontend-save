
let progressTimeout;

function lock(seconds, message) {
  let timeout = 10; // defaults to 10 seconds
  if (undefined !== seconds) {
    timeout = seconds;
  }
  if (undefined === message) {
    message = '';
  }
  document.querySelector('.progress-lock__message > span').InnerText = `${message} Please wait…`;
  document.querySelector('#progress-lock').style.display='block';
  if (timeout) {
    progressTimeout = window.setTimeout(() => {
      window.location.href = 'error_page.php?js=timeout';
    }, timeout * 1000);
  }
}

function unlock() {
  clearTimeout(progressTimeout);
  document.querySelector('#progress-lock').style.display='none';
}

export default { lock, unlock };
