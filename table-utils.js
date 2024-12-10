function createRow(testName, testId) {
  const tBody = document.getElementById('tests-body');

  const tr = document.createElement('tr');

  const td1 = document.createElement('td');
  td1.textContent = testName;

  const td2 = document.createElement('td');
  td2.id = testId + '-creator';

  const td3 = document.createElement('td');
  td3.id = testId + '-joiner';

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  tBody.appendChild(tr);
}
