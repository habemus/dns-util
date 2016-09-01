const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('nsMatches(hostname, targetAddresses)', function () {

  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    var dnsMock = {
      resolveNs: function (hostname, cb) {
        cb(null, [
          'ns1.test.habemus.xyz',
          'ns2.test.HABEMUS.xyz',
          'ns3.test.habemus.xyz',
        ]);
      },
    };
    mockery.registerMock('dns', dnsMock);
  });

  afterEach(function () {
    mockery.disable();
  });

  it('should return an object describing the matches, missing and extraneous', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.nsMatches('skirtsfor.men', [
        'ns2.test.habemus.xyz',
        'ns4.test.habemus.xyz',
      ])
      .then((results) => {
        results.matches.should.eql(['ns2.test.habemus.xyz']);
        results.missing.should.eql(['ns4.test.habemus.xyz']);
        results.extraneous.should.eql(['ns1.test.habemus.xyz', 'ns3.test.habemus.xyz'])
      });
  });

  it('should allow checking against only one ip address', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.nsMatches('skirtsfor.men', 'ns2.test.habemus.xyz')
      .then((results) => {
        results.matches.should.eql(['ns2.test.habemus.xyz']);
        results.missing.should.eql([]);
        results.extraneous.should.eql([
          'ns1.test.habemus.xyz',
          'ns3.test.habemus.xyz',
        ])
      });
  });

  it('should return no matches if an ENOTFOUND error is thrown', function () {

    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.nsMatches('domain.that.does.not-exist.habemus.xyz', ['ns1.test.habemus.xyz'])
      .then((results) => {
        results.matches.should.eql([]);
        results.missing.should.eql(['ns1.test.habemus.xyz']);
        results.extraneous.should.eql([]);
      });
  });

  it('should require targetAddresses to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.nsMatches('domain.com', undefined);
    });
  });
});
