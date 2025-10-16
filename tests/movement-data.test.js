const test = require('node:test');
const assert = require('node:assert/strict');
const { buildMovementData } = require('../movement-data.js');

test('buildMovementData filters headers and trims whitespace', () => {
  const rows = [
    ['Movement Name', 'Primary Muscle'],
    [' Wall Ball ', ' Quads '],
    ['Pull-Up', 'Back'],
    ['Sit-Up', 'Core'],
    ['   ', ''],
  ];
  const { accessoryMap, nextMoves } = buildMovementData(rows);
  assert.equal(accessoryMap.size, 3);
  assert.equal(accessoryMap.get('Wall Ball'), 'Quads');
  assert.equal(accessoryMap.get('Pull-Up'), 'Back');
  assert(nextMoves.has('Wall Ball'));
  assert(nextMoves.has('Pull-Up'));
  assert(nextMoves.has('Sit-Up'));
});

test('buildMovementData keeps latest target and ignores blanks', () => {
  const rows = [
    ['Sandbag Carry', 'Posterior'],
    ['Sandbag Carry', 'Posterior Chain'],
    ['Jump Rope', ''],
  ];
  const { accessoryMap, nextMoves } = buildMovementData(rows);
  assert.equal(accessoryMap.get('Sandbag Carry'), 'Posterior Chain');
  assert(!accessoryMap.has('Jump Rope'));
  assert(nextMoves.has('Sandbag Carry'));
  assert(nextMoves.has('Jump Rope'));
});
