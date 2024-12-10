function useLog(testId) {

  function appendLogLine(prefix, ...args) {
    const logArea = document.getElementById('logArea');
    const timestamp = new Date().toLocaleTimeString();
    const message = args.map(a => {
      if (typeof a === 'object') {
        return JSON.stringify(a);
      }
      return String(a);
    }).join(' ');

    logArea.value += `[${timestamp}] ${prefix}${message}\n`;
    logArea.scrollTop = logArea.scrollHeight;
  }

  function info(...args) {
    appendLogLine(`[${testId}] [INFO] `, ...args);
  }

  function error(...args) {
    appendLogLine(`[${testId}] [ERROR] `, ...args);
  }

  return {info, error}
}

async function copyLog() {
  const textToCopy = document.getElementById('logArea').value;
  const copyMsg = document.getElementById('copyMsg');
  try {
    await navigator.clipboard.writeText(textToCopy);
    copyMsg.textContent = "copied!";
  } catch (err) {
    copyMsg.textContent = "error!";
  }
}
