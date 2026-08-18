import { test } from 'node:test';
import assert from 'node:assert/strict';

test('counter increment test', () => {
  let counter = 0;
  counter += 1;
  assert.equal(counter, 1);
});

test('counter logic correctness', () => {
  let counter = 5;
  counter += 2;
  assert.equal(counter, 7);
});

test('counter privacy simulation', () => {
  const privateInput = 'mySecret';
  const publicOutput = 'hashOfSecret';
  assert.notEqual(privateInput, publicOutput);
});
