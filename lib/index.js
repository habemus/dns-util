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
 * Auxiliary function that builds
 * the test function to test a given hostname against.
 * 
 * @param  {Array} providers
 * @return {Array}
 */
function _buildProviderMatchers(providers) {
  return providers.map((providerData) => {

    var patterns = providerData.addresses.map((address) => {
      return new UrlPattern(address);
    });

    return {
      data: providerData,
      test: function (hostname) {
        return patterns.some((pattern) => {
          return pattern.match(hostname);
        });
      }
    };
  })
}

/**
 * Build the pattern matching methods
 * for each provider
 */
const NS_PROVIDERS = _buildProviderMatchers(require('../data/ns-providers'));

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
exports.resolveIpv4Diff = function (hostname, targetAddresses) {

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

      if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return aux.computeArrayDiff([], targetAddresses);
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};

/**
 * Resolves the cname dns record of the hostname
 * and compares it with the target addresses provided
 * 
 * @param  {String} hostname
 * @param  {Array|String} targetAddresses
 * @return {Bluebird -> Diff}
 */
exports.resolveCnameDiff = function (hostname, targetAddresses) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  targetAddresses = Array.isArray(targetAddresses) ?
    targetAddresses : [targetAddresses];

  return dns.resolveCnameAsync(hostname)
    .then((foundAddresses) => {
      return aux.computeArrayDiff(foundAddresses, targetAddresses);
    })
    .catch((err) => {

      if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return aux.computeArrayDiff([], targetAddresses);
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};

/**
 * [txtMatches description]
 * @param  {[type]} hostname          [description]
 * @param  {[type]} targetTxtEntries [description]
 * @return {[type]}                   [description]
 */
exports.resolveTxtDiff = function (hostname, targetTxtEntries) {

  if (!targetTxtEntries) {
    throw new Error('targetTxtEntries is required');
  }

  targetTxtEntries = Array.isArray(targetTxtEntries) ?
    targetTxtEntries : [targetTxtEntries];

  return dns.resolveTxtAsync(hostname)
    .then((foundTxtEntries) => {
      /**
       * From node.js DNS module docs
       * https://nodejs.org/api/dns.html#dns_dns_resolvetxt_hostname_callback
       * 
       * Uses the DNS protocol to resolve text queries (TXT records) for
       * the hostname. The addresses argument passed to the callback function
       * is is a two-dimentional array of the text records available for hostname 
       * (e.g., [ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]). 
       * Each sub-array contains TXT chunks of one record. 
       * Depending on the use case, these could be either 
       * joined together or treated separately.
       */
      foundTxtEntries = foundTxtEntries.reduce((acc, entry) => {
        return acc.concat(entry);
      }, []);

      return aux.computeArrayDiff(foundTxtEntries, targetTxtEntries);
    })
    .catch((err) => {

      if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return aux.computeArrayDiff([], targetTxtEntries);
      } else {
        // unknown error, throw it
        throw err;
      }
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
exports.resolveNsDiff = function (hostname, targetAddresses) {

  if (!targetAddresses) {
    throw new Error('targetAddresses is required');
  }

  targetAddresses = Array.isArray(targetAddresses) ?
    targetAddresses : [targetAddresses];

  return dns.resolveNsAsync(hostname)
    .then((foundAddresses) => {

      foundAddresses = foundAddresses.map((address) => {
        return address.toLowerCase();
      });

      return aux.computeArrayDiff(foundAddresses, targetAddresses);
    })
    .catch((err) => {

      if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return aux.computeArrayDiff([], targetAddresses);
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};

/**
 * Attempts to retrieve data about the ns provider.
 *
 * Matches against the entries of the json data file.
 *
 * Optionally takes a `providers` array as second argument that
 * overrides the default providers array.
 * 
 * @param  {String} hostname
 * @return {Bluebird -> Object || Null}
 */
exports.searchNsProviderData = function (hostname, providers) {

  if (providers) {
    providers = _buildProviderMatchers(providers);
  } else {
    providers = NS_PROVIDERS;
  }

  return dns.resolveNsAsync(hostname)
    .then((foundAddresses) => {

      foundAddresses = foundAddresses.map((address) => {
        return address.toLowerCase();
      });

      var provider = providers.find((p) => {
        return foundAddresses.some((address) => {
          return p.test(address);
        });
      });

      if (provider) {
        return provider.data;
      } else {
        return null;
      }

    })
    .catch((err) => {
      if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
        // behave like no addresses were found
        return null;
      } else {
        // unknown error, throw it
        throw err;
      }
    });
};
