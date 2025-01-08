module.exports = {
  apps: [{
    name: 'Kino2.O',
    cwd: '/var/www/Kino2.O/my-app',  // Specify the correct working directory
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
} 