const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('resolveIpv4Diff(hostname, targetAddresses)', function () {

  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    var dnsMock = {
      resolve4: function (hostname, cb) {
        cb(null, [
          '0.0.0.0',
          '1.1.1.1',
          '2.2.2.2',
          '3.3.3.3'
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

    return hDns.resolveIpv4Diff('skirtsfor.men', ['3.3.3.3', '4.4.4.4'])
      .then((results) => {
        results.matches.should.eql(['3.3.3.3']);
        results.missing.should.eql(['4.4.4.4']);
        results.extraneous.should.eql(['0.0.0.0', '1.1.1.1', '2.2.2.2'])
      });
  });

  it('should allow checking against only one ip address', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.resolveIpv4Diff('skirtsfor.men', '3.3.3.3')
      .then((results) => {
        results.matches.should.eql(['3.3.3.3']);
        results.missing.should.eql([]);
        results.extraneous.should.eql(['0.0.0.0', '1.1.1.1', '2.2.2.2'])
      });
  })

  it('should return no matches if no matching addresses are found', function () {
    const hDns = require('../../lib');

    return hDns.resolveIpv4Diff('skirtsfor.men', ['4.4.4.4'])
      .then((results) => {
        results.matches.should.eql([]);
        results.missing.should.eql(['4.4.4.4'])
        results.extraneous.should.eql([
          '0.0.0.0',
          '1.1.1.1',
          '2.2.2.2',
          '3.3.3.3'
        ]);
      });
  });

  it('should return no matches if an ENOTFOUND error is thrown', function () {
    this.timeout(10000)

    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.resolveIpv4Diff('domain.that.does.not-exist.habemus.xyz', ['0.0.0.0'])
      .then((results) => {
        results.matches.should.eql([]);
        results.missing.should.eql(['0.0.0.0']);
        results.extraneous.should.eql([]);
      });
  });

  it('should require targetAddresses to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.resolveIpv4Diff('domain.com', undefined);
    });
  });
});
