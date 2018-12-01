# YAC #
*Yeat Another Cron service.*

This is only for testing purposes.

I pretend to learn and test different aspects of Redis. I mainly want to try the Stream data type of redis. 

## Expected Features ##

- It MUST to be able to scale horizontally.
- It MUST to emit events to Redis Stream service.
- It SHOULD be have REST API for add and delete tasks.
- It SHOULD be to run in Docker and Kubernetes.

## Principal Idea ##

This service, only check if exists something to run in their tasks.
Every task is defined as follows:

- An unique ID.
- A string with informacion on when to run (cron special syntax).
- An owner. This is not about a person or user, but it refers to the name 
of stream. The idea is that each type of task have a specific STREAM channel on redis.
- Optional *params*. 
