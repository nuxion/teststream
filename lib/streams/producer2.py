import random
import time
from connect import connectR

r = connectR()
# xgroup create test group44 0 mkstream
#r.xgroup_create("mystream", "group44", 0, mkstream=True)

while True:
    number = random.randint(1,101)
    r.xadd("mystream", {"task-id":number})
    text = "1 r.xadd('mystream', 'task-id':{})".format(number)
    print("Command: {}".format(text))
    time.sleep(2)
#r.sadd("Test", ['hola'])

