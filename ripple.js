// Generated by LiveScript 1.5.0
(function(){
  var superagent, ref$, deriveKeypair, deriveAddress, generateSeed, big, hashjs, endpoint, generateUniqueRippleAddress, getTransactions, createTransactionsSendAllFundTo, getCurrentRippleToUSDRate, pushTransaction, query, out$ = typeof exports != 'undefined' && exports || this;
  superagent = require('superagent');
  ref$ = require('ripple-keypairs'), deriveKeypair = ref$.deriveKeypair, deriveAddress = ref$.deriveAddress, generateSeed = ref$.generateSeed;
  big = require('big.js');
  hashjs = require('hash.js');
  endpoint = "http://s2.ripple.com:51234/";
  out$.generateUniqueRippleAddress = generateUniqueRippleAddress = function(seed){
    var entropy, secret, keypair, address;
    entropy = hashjs.sha512().update(seed).digest().slice(0, 32);
    secret = generateSeed({
      entropy: entropy
    });
    keypair = deriveKeypair(secret);
    address = deriveAddress(keypair.publicKey);
    return {
      address: address,
      secret: secret
    };
  };
  out$.getTransactions = getTransactions = function(account, cb){
    var data;
    data = {
      method: 'account_tx',
      params: [{
        account: account
      }]
    };
    query(data, function(err, res){
      if (err) {
        cb && cb(err, res);
      }
      return cb && cb(err, res.transactions);
    });
  };
  out$.createTransactionsSendAllFundTo = createTransactionsSendAllFundTo = function(secret, addressFrom, addressTo, amount, cb){
    var data;
    data = {
      method: 'sign',
      params: [{
        secret: secret,
        tx_json: {
          Account: addressFrom,
          Destination: addressTo,
          Amount: big(amount).mul(Math.pow(10, 6)).toFixed(),
          TransactionType: 'Payment'
        }
      }]
    };
    query(data, function(err, res){
      if (err) {
        cb && cb(err, res);
      }
      return cb && cb(err, res);
    });
  };
  out$.getCurrentRippleToUSDRate = getCurrentRippleToUSDRate = function(cb){
    var exmo_endpoint, poloniex_endpoint, kraken_endpoint, user_agent, result;
    exmo_endpoint = 'https://api.exmo.com/v1/ticker/';
    poloniex_endpoint = 'https://poloniex.com/public';
    kraken_endpoint = 'https://api.kraken.com/0/public/Ticker';
    user_agent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36';
    result = {};
    return superagent.get(exmo_endpoint).timeout({
      deadline: 15000
    }).end(function(exmo_err, exmo_res){
      result.exmo = exmo_err
        ? exmo_err.message
        : exmo_res.body.XRP_USD;
      superagent.get(poloniex_endpoint).set('user-agent', user_agent).query({
        command: 'returnTicker'
      }).timeout({
        deadline: 15000
      }).end(function(poloniex_err, poloniex_res){
        result.poloniex = poloniex_err
          ? poloniex_err.message
          : poloniex_res.body.USDT_XRP;
        superagent.get(kraken_endpoint).query({
          pair: 'XRPUSD'
        }).timeout({
          deadline: 15000
        }).end(function(kraken_err, kraken_res){
          result.kraken = kraken_err
            ? kraken_err.message
            : kraken_res.body.result.XXRPZUSD;
          cb && cb(null, result);
        });
      });
    });
  };
  out$.pushTransaction = pushTransaction = function(tx, cb){
    var data;
    data = {
      method: 'submit',
      params: [{
        tx_blob: tx
      }]
    };
    query(data, function(err, res){
      if (err) {
        cb && cb(err, res);
      }
      return cb && cb(err, res);
    });
  };
  query = function(arg$, cb){
    var ref$, method, params, p, req;
    ref$ = arg$ != null
      ? arg$
      : [], method = ref$.method, params = ref$.params;
    p = {
      method: method,
      params: params
    };
    req = superagent.post(endpoint).send(p);
    return req.timeout({
      deadline: 15000
    }).end(function(err, res){
      var result;
      if (err) {
        return cb && cb(err, body);
      }
      if (!res.body) {
        err = Error('no response');
        err.code = res.status;
      }
      if (res.status !== 200) {
        err = Error(res.body);
        err.code = res.status;
      }
      result = void 8;
      if (res.body.error) {
        err = Error(res.body.error);
        err.code = res.status;
        result = res.body;
      } else {
        result = res.body.result;
      }
      cb && cb(err, result);
    });
  };
}).call(this);
