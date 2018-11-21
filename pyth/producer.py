from connect import connectR

r = connectR()

r.xadd("mystream", {"task-id":1234})
#r.sadd("Test", ['hola'])

