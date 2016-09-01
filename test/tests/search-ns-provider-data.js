const assert = require('assert');

const should  = require('should');
const mockery = require('mockery');

describe('searchNsProviderData', function () {

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
          'ns2.test.habemus.xyz',
          'ns3.test.habemus.xyz',
        ]);
      },
    };
    mockery.registerMock('dns', dnsMock);
  });

  afterEach(function () {
    mockery.disable();
  });

  it('should match against exact ns provider addresses', function () {
    const hDns = require('../../lib');

    return hDns.searchNsProviderData('website.habemus.xyz', [
      {
        addresses: [
          'ns.test.another.habemus.xyz',
        ],
        name: 'Another test NS'
      },
      {
        addresses: [
          'ns2.test.habemus.xyz',
        ],
        name: 'Test NS'
      },
    ])
    .then((providerData) => {
      providerData.name.should.eql('Test NS');
    });
  });

  it('should match against wildcard ns provider addresses', function () {
    const hDns = require('../../lib');

    return hDns.searchNsProviderData('website.habemus.xyz', [
      {
        addresses: [
          'ns.test.another.habemus.xyz',
        ],
        name: 'Another test NS'
      },
      {
        addresses: [
          '*.test.habemus.xyz',
        ],
        name: 'Test NS'
      },
    ])
    .then((providerData) => {
      providerData.name.should.eql('Test NS');
    });
  });

  it('should return null if no provider is found', function () {
    const hDns = require('../../lib');

    return hDns.searchNsProviderData('website.habemus.xyz', [
      {
        addresses: [
          'ns1.not.this.habemus.xyz',
        ],
        name: 'Another test NS'
      },
      {
        addresses: [
          'ns1.not.this.either.habemus.xyz',
        ],
        name: 'Test NS'
      },
    ])
    .then((providerData) => {
      should(providerData).eql(null);
    });
  });

  it('should use the embedded ns-providers.json data if not passed an array of providers', function () {
    const hDns = require('../../lib');

    return hDns.searchNsProviderData('website.habemus.xyz').then((providerData) => {
      should(providerData).eql(null);
    });
  });

});
