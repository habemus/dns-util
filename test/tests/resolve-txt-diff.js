const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('resolveTxtDiff', function () {

  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    var dnsMock = {
      resolveTxt: function (hostname, cb) {
        cb(null, [
          ['5a49aac5f2744d66a3b89bf0f62328ba'],
          ['another text'],
          ['banana']
        ]);
      },
    };
    mockery.registerMock('dns', dnsMock);
  });

  afterEach(function () {
    mockery.disable();
  });

  it('should return missing.length === 0 if all target txt entries are found in the resolved txt records', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.resolveTxtDiff('test.habemus.xyz', [
        '5a49aac5f2744d66a3b89bf0f62328ba',
        'another text'
      ])
      .then((txtDiff) => {
        txtDiff.matches.length.should.equal(2);
        txtDiff.missing.length.should.equal(0);
        txtDiff.extraneous.length.should.equal(1);
      });
  });

  it('should return all target txt entries as missing if an ENOTFOUND error is thrown', function () {
    this.timeout(10000)
    
    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.resolveTxtDiff('test.habemus.xyz', [
        'not',
        'another text'
      ])
      .then((txtDiff) => {
        txtDiff.matches.length.should.equal(0);
        txtDiff.missing.length.should.equal(2);
        txtDiff.extraneous.length.should.equal(0);
      });
  });

  it('should allow checking against a signle text entry', function () {
    const hDns = require('../../lib');

    return hDns.resolveTxtDiff('test.habemus.xyz', 'banana')
      .then((txtDiff) => {
        txtDiff.matches.length.should.equal(1);
        txtDiff.missing.length.should.equal(0);
        txtDiff.extraneous.length.should.equal(2);
      });
  });

  it('should require targetTxtEntries to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.resolveTxtDiff('domain.com', undefined);
    });
  });
});
