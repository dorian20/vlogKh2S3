'use strict'

/**
 * Simple class to help geocode IP addresses using freegeoip.net.
 * 
 * NOTE: this is intended for demo purposes only.
 */

const https = require('https');

const serviceHost = 'api.ipgeolocation.io';
const servicePath = '/ipgeo';

module.exports = (ipAddress) => {

  let options = {
    hostname: serviceHost,
    path: `${servicePath}?ip=${ipAddress}&apiKey=914ace6e16404ba5ac0a72f0de450095`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {

    https.get(options, (res) => {
        /**
         * When the geocoding service returns a 403, we have exceeded the rate
         * limit allowed. Instead of throwing an error, just return a null
         * response here so that execution can continue otherwise.
         */
        if (res.statusCode === 403) {
          console.warn('[geocoder] Exceeded rate limit');
          resolve(null);
          return;
        } else if (res.statusCode !== 200) {
          console.error('[geocoder] Received bad error code ' + res.statusCode);
          reject(new Error(`Request failed with status code ${res.statusCode}`));
          return;
        }

        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            let json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', (e) => {
        reject(e);
      });

  });
}