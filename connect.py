import redis


def connectR(host="redis-stream", port=6379, db=0):
    r = redis.StrictRedis(host=host, port=port, db=db)
    r.client_list()
    return r
