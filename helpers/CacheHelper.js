const MemcachedStore = require("connect-memcached");
const Memcached = require("memcached");
let _sessionCache = null;

let sessionCache = null;
let genericCache = null;

function getSessionCache(session) {
  if (_sessionCache === null) {
    console.log(
      `will set sessionstore to memcache ${process.env.MEMCACHED_URL}`
    );
    _sessionCache = MemcachedStore(session);
    sessionCache = new _sessionCache({
      hosts: [process.env.MEMCACHED_URL],
      secret: "123, easy as ABC. ABC, easy as 123", // Optionally use transparent encryption for memcache session data
      // ttl: 90000,
      // maxExpiration: 90000,
    });
  }
  return sessionCache;
}

function getCache() {
  if (genericCache === null) {
    console.log(
      `will set generic cache to memcache ${process.env.MEMCACHED_URL}`
    );
    const cacheUrl = process.env.MEMCACHED_URL?process.env.MEMCACHED_URL:'localhost:11111';
    genericCache = new Memcached(cacheUrl, {
      retries: 10,
      retry: 10000,
      remove: true,
      maxExpiration: 90000,
    });
  }
  return genericCache;
}

export { getSessionCache, getCache };
