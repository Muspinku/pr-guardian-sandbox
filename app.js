#!/usr/bin/env node
// pr-guardian-sandbox: tiny todo CLI (toy app for the PR Guardian demo).
// Usage: node app.js add "Buy milk" | node app.js list | node app.js done 2
const fs = require('node:fs');
const STORE = '.todos.json';

function load() {
  try { return JSON.parse(fs.readFileSync(STORE, 'utf8')); }
  catch { return []; }
}
function save(todos) { fs.writeFileSync(STORE, JSON.stringify(todos, null, 2)); }
function countRemaining(todos) { return todos.filter(t => !t.done).length; }

function main() {
  const [cmd, arg] = process.argv.slice(2);
  const todos = load();
  if (cmd === 'add' && arg) {
    todos.push({ text: arg, done: false });
    save(todos);
    console.log(`Added #${todos.length}: ${arg}`);
  } else if (cmd === 'list') {
    todos.forEach((t, i) => console.log(`${i + 1}. [${t.done ? 'x' : ' '}] ${t.text}`));
    console.log(`${countRemaining(todos)} remaining`);
  } else if (cmd === 'done' && arg) {
    const n = Number(arg);
    const todo = todos[n - 1]; // 1-based numbering, matches list output
    if (!todo) { console.error(`No todo #${n}`); process.exit(1); }
    todo.done = true;
    save(todos);
    console.log(`Done #${n}: ${todo.text}`);
  } else {
    console.log('Usage: node app.js add "task" | node app.js list | node app.js done <n>');
    process.exit(1);
  }
}
main();

function broken( {
