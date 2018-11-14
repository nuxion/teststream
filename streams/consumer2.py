import time
import sys
from connect import connectR

consumer = sys.argv[1]
blocktime = int(sys.argv[2])
sleep = int(sys.argv[3])
r = connectR()
#import pdb; pdb.set_trace()
#for x in range(1, 10):
#result = r.xread({"mystream": 0})

while True:
    result = r.xreadgroup("group55", consumer, {"mystream": '>'}, block=blocktime)
    print(result)
    time.sleep(sleep)
    if result:
        eventid = result[0][1][0][0]
        r.xack("mystream", "group55", eventid )


