async function submitToJsonBin() {
  const apiKey = "$2a$10$b4KfEv/2F.0Ao.qJJBpplOHpDhYtyq4MwMFnEdkY2.pSxXLcMSQu.";

  const resultElement = document.getElementById('result');
  const text = document.getElementById('logArea').value;
  const jsonData = { "log": text };

  try {
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      resultElement.textContent = 'Error: ' + errorText;
      return;
    }

    const resultJson = await response.json();
    const binId = resultJson.metadata.id;
    resultElement.textContent = 'jsonbin id: ' + binId;
  } catch (err) {
    resultElement.textContent = 'Error: ' + err;
  }
}
