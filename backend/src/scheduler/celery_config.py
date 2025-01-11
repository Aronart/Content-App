# celeryconfig.py
broker_url = 'redis://localhost:6379/0'  # Change to your Redis or RabbitMQ URL
result_backend = 'redis://localhost:6379/0'  # Backend for storing results

# Other settings
accept_content = ['json']
task_serializer = 'json'
result_serializer = 'json'
timezone = 'UTC'
enable_utc = True
