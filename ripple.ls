require! {
    \superagent
    \ripple-keypairs : {deriveKeypair, deriveAddress, generateSeed}
    \big.js : big
    \hash.js : hashjs
}
endpoint = "http://s2.ripple.com:51234/"

export generateUniqueRippleAddress = (seed) ->
  entropy = (hashjs.sha512!.update seed).digest!.slice 0, 32
  secret = generateSeed {entropy: entropy}
  keypair = deriveKeypair secret
  address = deriveAddress keypair.publicKey
  return {address, secret}

export getTransactions = (account, cb) ->
  data = {
    method: 'account_tx'
    params: [{account: account}]
  }
  query data, (err, res) ->
    cb && cb err, res if err
    cb && cb err, res.transactions
  return


export createTransactionsSendAllFundTo = (secret, addressFrom, addressTo, amount, cb) ->
  data = {
    method: 'sign'
    params: [{
      secret: secret,
      tx_json: {
        Account: addressFrom,
        Destination: addressTo,
        Amount: big(amount).mul(10^6).to-fixed!
        TransactionType: 'Payment'
      }
    }]
  }
  query data, (err, res) ->
    cb && cb err, res if err
    cb && cb err, res
  return

export getCurrentRippleToUSDRate = (cb) ->
  exmo_endpoint = 'https://api.exmo.com/v1/ticker/'
  poloniex_endpoint = 'https://poloniex.com/public'
  kraken_endpoint = 'https://api.kraken.com/0/public/Ticker'
  user_agent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
  result = {}
  exmo_err, exmo_res <-! superagent.get(exmo_endpoint).timeout(deadline: 15000).end
  result.exmo = if exmo_err then exmo_err.message else exmo_res.body.XRP_USD
  poloniex_err, poloniex_res <-! superagent.get(poloniex_endpoint).set('user-agent', user_agent).query({command: 'returnTicker'}).timeout(deadline: 15000).end
  result.poloniex = if poloniex_err then poloniex_err.message else poloniex_res.body.USDT_XRP
  kraken_err, kraken_res <-! superagent.get(kraken_endpoint).query({pair: 'XRPUSD'}).timeout(deadline: 15000).end
  result.kraken = if kraken_err then kraken_err.message else kraken_res.body.result.XXRPZUSD
  cb && cb null, result

export pushTransaction = (tx, cb) ->
  data = {
    method: 'submit'
    params: [{
      tx_blob: tx
    }]
  }
  query data, (err, res) ->
    cb && cb err, res if err
    cb && cb err, res
  return

query = ({method, params} = [], cb) ->
  p = method: method, params: params
  req = superagent.post(endpoint).send(p)
  err, res <-! req.timeout(deadline: 15000).end
  return cb && cb err, body if err
  if not res.body
    err = Error 'no response'
    err.code = res.status
  if res.status isnt 200
    err = Error res.body
    err.code = res.status
  result = void
  if res.body.error
    err = Error res.body.error
    err.code = res.status
    result = res.body
  else
    result = res.body.result
  cb && cb err, result
