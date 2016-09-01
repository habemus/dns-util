const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('txtContains', function () {

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

  it('should return true if the required txt entries are in contained in the txt entries', function () {
    // load the lib inside test so that mockery
    // can replace it
    const hDns = require('../../lib');

    return hDns.txtContains('test.habemus.xyz', [
        '5a49aac5f2744d66a3b89bf0f62328ba',
        'another text'
      ])
      .then((contains) => {
        contains.should.eql(true);
      });
  });

  it('should return false if the required txt entries are not in the txt entries of the hostname', function () {
    const hDns = require('../../lib');

    return hDns.txtContains('test.habemus.xyz', [
        'not',
        'another text'
      ])
      .then((contains) => {
        contains.should.eql(false);
      });
  });

  it('should return false if an ENOTFOUND error is thrown', function () {
    mockery.deregisterAll();
    const hDns = require('../../lib');

    return hDns.txtContains('test.habemus.xyz', [
        'not',
        'another text'
      ])
      .then((contains) => {
        contains.should.eql(false);
      });
  });

  it('should allow checking against a signle text entry', function () {
    const hDns = require('../../lib');

    return hDns.txtContains('test.habemus.xyz', 'banana')
      .then((contains) => {
        contains.should.eql(true);
      });
  });

  it('should require targetTxtEntries to be passed', function () {
    const hDns = require('../../lib');

    assert.throws(function () {
      hDns.txtContains('domain.com', undefined);
    });
  });
});
