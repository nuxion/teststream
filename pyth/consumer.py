import time
from connect import connectR

r = connectR()

for x in range(1, 10):
    r.xread("mystream")

