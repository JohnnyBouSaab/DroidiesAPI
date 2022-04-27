const compression = require('compression');
const axios = require('axios');
const express = require('express');
const pjs = require('./p.js');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

function getRPC(chain) {
  if (chain == "main") {
    RPC_URL = "http://207.148.17.86:7078/";
  } else if(chain == "testnet") {
    RPC_URL = "http://testnet.phantasma.io:7078/";
  } else {
    RPC_URL = "http://127.0.0.1:7078/";
  }
  return RPC_URL;
}

app.get('/balance', (req, res) => {

  let addr = req.query.address;
  let chain = req.query.chain;
  let RPC_URL = getRPC(chain);
  let URL = RPC_URL + 'api/getTokenBalance?account=' + addr + '&tokenSymbol=DROID&chainInput=main';

  axios
  .get(URL)
  .then(resp => {
    try {
      let data = resp.data;
      if(data && !data.error) {
        if(data['amount'] > 0) {

          let DROIDIES = data['ids'];
          console.log(DROIDIES);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({balance: DROIDIES.length, droidies: DROIDIES}));

        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ balance: 0 }));
        }

      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
      }
    } catch(err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
    }
  })
  .catch(error => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
  });
});

app.get('/getDroidy', (req, res) => {
  let id = req.query.id;
  let chain = req.query.chain;
  let RPC_URL = getRPC(chain);
  let URL = RPC_URL + 'api/getNFT?symbol=DROID&IDtext=' + id;

  axios
  .get(URL)
  .then(resp => {
    try {

      let data = resp.data;
      if(data && !data.error) {

        let rom = data['rom'];
        let droid_idx = (pjs.phantasmaJS.decodeVMObject(rom))['idx'];

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ idx: droid_idx }));

      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
      }
      
    } catch(err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
    }
  })
  .catch(error => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Failed to fetch chain info" }));
  });
});

const server = app.listen(process.env.PORT || port, () => {
  const port = server.address().port;
  console.log('Running on port ${port}');
});

app.use(compression());