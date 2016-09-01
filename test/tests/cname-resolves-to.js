const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('cnameResolvesTo', function () {

  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    var dnsMock = {
      resolveCname: function (hostname, cb) {
        cb(null, [
          'test.domain.com',
        ]);
      }
    };
    mockery.registerMock('dns', dnsMock);
  });

  afterEach(function () {
    mockery.disable();
  });

  it('should return true if the cname is resolved to the asked domain', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.cnameResolvesTo('test.another.domain.com', 'test.domain.com')
      .then((resolvesTo) => {
        resolvesTo.should.equal(true);
      });
  });

  it('should return false if the cname is resolved to another value', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.cnameResolvesTo('test.another.domain.com', 'test.yet-another.domain.com')
      .then((resolvesTo) => {
        resolvesTo.should.equal(false);
      });
  });

  it('should return false if an ENOTFOUND error is thrown', function () {
    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.cnameResolvesTo('does.not.exist.habemus.xyz', 'test.domain.com')
      .then((resolvesTo) => {
        resolvesTo.should.equal(false);
      });
  });

  it('should require targetAddress to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.cnameResolvesTo('domain.com', undefined);
    });
  });
});
