// native
const dns = require('dns');

// third-party
const Bluebird   = require('bluebird');
const UrlPattern = require('url-pattern');

// promisify dns methods
Bluebird.promisifyAll(dns);

// auxiliary methods
const aux = require('./auxiliary');

/**
 * Checks whether the resolved ipv4 addresses for a hostname
 * match the provided target addresses
 *
 * Returns an object describing matches
 * 
 * @param  {String} hostname
 * @param  {Array|String} targetAddresses
 * @return {Bluebird -> Object}
 */
exports.ipv4Matches = function (hostname, targetAddresses) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  targetAddresses = Array.isArray(targetAddresses) ?
    targetAddresses : [targetAddresses];

  return dns.resolve4Async(hostname)
    .then((foundAddresses) => {
      return aux.computeArrayDiff(foundAddresses, targetAddresses);
    })
    .catch((err) => {

      if (err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return aux.computeArrayDiff([], targetAddresses);
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};

/**
 * Checks whether a hostname CNAME entry resolves
 * to the target address
 * 
 * @param  {String} hostname
 * @param  {String} targetAddress
 * @return {Bluebird -> Boolean}
 */
exports.cnameResolvesTo = function (hostname, targetAddress) {

  if (!targetAddress) {
    throw new Error('targetAddress is required');
  }

  return dns.resolveCnameAsync(hostname)
    .then((foundAddresses) => {
      return foundAddresses[0] === targetAddress;
    })
    .catch((err) => {

      if (err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return false;
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};

/**
 * Checks whether the TXT entries of a given hostname
 * contain the target text entries.
 * 
 * @param  {String} hostname
 * @param  {Array|String} targetTextEntries
 * @return {Bluebird -> Object}
 */
exports.txtMatches = function (hostname, targetTextEntries) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  return dns.resolveTxtAsync(hostname)
    .then((addresses) => {

    })
    .catch((err) => {
      return false;
    });
};

/**
 * Checks whether the NS entries for the given hostname
 * match the provided targetAddresses.
 * 
 * @param  {String} hostname
 * @param  {Array|String} targetAddresses
 * @return {Bluebird -> Object}
 */
exports.nsMatches = function (hostname, targetAddresses) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  targetAddresses = Array.isArray(targetAddresses) ?
    targetAddresses : [targetAddresses];

  return dns.resolveNsAsync(hostname)
    .then((addresses) => {

    })
    .catch((err) => {
      return false;
    });
};

exports.getNsProvider = function (hostname) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  return dns.resolveNsAsync(hostname)
    .then((addresses) => {

    })
    .catch((err) => {
      return false;
    });
};
