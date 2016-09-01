const hDns = require('./lib');
const Bluebird = require('bluebird');

var domains = [
  'habemus.xyz',
  'fernandavazstudio.com',
  'ovoestudio.com.br',
  'educkf.com.br',
  'skirtsfor.men',
  // 'estadao.com.br',
  // 'folha.uol.com.br',
  'www.nexojornal.com.br',
  'pesquiseria.com.br',
  'cidadeemmovimento.org',
  'mindcloud.co',
  'theguardian.com',
  'mlab.com',
  'www.aboutdebian.com',
  'ocks.org',
  'danielmiessler.com',
  'ubuntu.com',
  'www.inc.com',
  'techcrunch.com',
  'catracalivre.com.br',
  'techmeme.com',
  'www.jqueryrain.com',
  'www.sbs.com.br',
  'www.gruponaturaldaterra.com.br',
  'attasi.com',
];

Bluebird.all(domains.map((domain) => {
  return hDns.searchNsProviderData(domain);
}))
.then((providersData) => {

  var d = domains.reduce((res, domain, index) => {

    if (providersData[index]) {
      res[domain] = providersData[index].name;
    } else {
      res[domain] = null;
    }

    return res;
  }, {});

  console.log(d);
});

// hDns.searchNsProviderData('habemus.xyz').then((data) => {
//   console.log(data);
// });

// hDns.searchNsProviderData('fernandavazstudio.com').then((data) => {
//   console.log(data);
// });

// hDns.searchNsProviderData('ovoestudio.com.br').then((data) => {
//   console.log(data);
// });

// hDns.searchNsProviderData('educkf.com.br').then((data) => {
//   console.log(data);
// });

// hDns.searchNsProviderData('skirtsfor.men').then((data) => {
//   console.log(data);
// });
