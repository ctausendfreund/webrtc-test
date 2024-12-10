function createRow(testName, testId) {
  const tBody = document.getElementById('tests-body');
  const tr = document.createElement('tr');

  const testNameCell = document.createElement('td');
  testNameCell.textContent = testName;

  const creatorStateCell = document.createElement('td');
  creatorStateCell.id = testId + '-creator';

  const joinerStateCell = document.createElement('td');
  joinerStateCell.id = testId + '-joiner';

  tr.appendChild(testNameCell);
  tr.appendChild(creatorStateCell);
  tr.appendChild(joinerStateCell);

  tBody.appendChild(tr);

  return {
    updateCreatorState: state => creatorStateCell.textContent = state,
    updateJoinerState: state => joinerStateCell.textContent = state
  }
}
