const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('resolveCnameDiff', function () {

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

  it('should return missing.length === 0 if the cname is resolved to the asked domain', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.resolveCnameDiff('test.another.domain.com', 'test.domain.com')
      .then((cnameDiff) => {

        cnameDiff.missing.length.should.equal(0);
        cnameDiff.matches.length.should.equal(1);
        cnameDiff.extraneous.length.should.equal(0);

      });
  });

  it('should return missing.length === 1 if the cname is resolved to another value', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.resolveCnameDiff('test.another.domain.com', 'test.yet-another.domain.com')
      .then((cnameDiff) => {

        cnameDiff.missing.length.should.equal(1);
        cnameDiff.matches.length.should.equal(0);
        cnameDiff.extraneous.length.should.equal(1);

      });
  });

  it('should return missing.length === 1 if an ENOTFOUND error is thrown', function () {
    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.resolveCnameDiff('does.not.exist.habemus.xyz', 'test.domain.com')
      .then((cnameDiff) => {

        cnameDiff.missing.length.should.equal(1);
        cnameDiff.matches.length.should.equal(0);
        cnameDiff.extraneous.length.should.equal(0);

      });
  });

  it('should require targetAddress to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.resolveCnameDiff('domain.com', undefined);
    });
  });
});
