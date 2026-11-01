module.exports = {
    apps: [
        {
            name: 'ecommerce-backend',
            script: './dist/server.js', // Ensure you run 'npm run build' first
            instances: 'max', // Use all available CPU cores
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '500M', // Restart if memory exceeds 500MB
            env: {
                NODE_ENV: 'development',
                PORT: 5000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        }
    ]
};
