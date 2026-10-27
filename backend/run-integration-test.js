const { spawn } = require('child_process');
const path = require('path');

const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
});

setTimeout(() => {
  const testProcess = spawn('node', ['test-api.js'], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  testProcess.on('exit', (code) => {
    serverProcess.kill();
    process.exit(code);
  });
}, 2000);
