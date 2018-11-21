import time
from connect import connectR

r = connectR()

#for x in range(1, 10):
#result = r.xread({"mystream": 0})
result = r.xreadgroup("group44", "consumer", {"mystream": 0})
print(result)

