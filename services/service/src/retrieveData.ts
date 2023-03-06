// IMPLEMENT YOUR SOLUTION HERE!!
export const retrieveData = (currency,callback) => {
  const https = require('node:https');
  const apiKey = '83DTVE7BUZ4U2PDV';
  const myURL = new URL ('https://www.alphavantage.co/query?function=FX_DAILY&from_symbol='+currency+'&to_symbol=EUR&apikey='+apiKey);

  const options = {
    hostname: myURL.hostname,
    port: 443,
    path: myURL.pathname+myURL.search,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      callback(rawData);
    });
  });

  req.on('error', (e) => {
    callback(e);
  });

  req.end();
}
