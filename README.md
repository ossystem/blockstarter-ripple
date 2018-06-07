# Blockstarter Ripple
This is library helps to integrate blockstarter with Ripple

## Install

```
npm i blockstarter-ripple
```

## Available functions

* generateUniqueRippleAddress
* getTransactions
* createTransactionsSendAllFundTo
* getCurrentRippleToUSDRate
* pushTransaction


## Usage

### Ripple Address

Creating a unique Ripple Address

```Javascript
var br = require('blockstarter-ripple');
var newAddress = br.generateUniqueRippleAddress('your seed');
console.log(newAddress);
```
### List transactions

A list of all incoming transactions for the address

```Javascript
var br = require('blockstarter-ripple');
var newAddress = br.getTransactions('ripple address', function(err, transactions){
  if (err != null) {
    throw err;
  }
  console.log(transactions);
});
```

### Сreate a transaction
Сreate a transaction to transfer funds from one address to another

```Javascript
var br = require('blockstarter-ripple');
var newAddress = br.createTransactionsSendAllFundTo('your secret', 'address from', 'address to', 'amount', function(err, res){
  if (err != null) {
    throw err;
  }
  console.log(res);
});
```

### Exchange rate
The course is considered for the 3 exchanges EXMO, POLONIEX, KRAKEN

```Javascript
var br = require('blockstarter-ripple');
var newAddress = br.getCurrentRippleToUSDRate(function(err, rates){
  if (err != null) {
    throw err;
  }
  console.log(rates);
});
```
Example retrun value
```
{ exmo:
   { buy_price: '0.56500283',
     sell_price: '0.56500565',
     last_trade: '0.565',
     high: '0.61411',
     low: '0.56491737',
     avg: '0.59404117',
     vol: '1318654.76139709',
     vol_curr: '745039.94018936',
     updated: 1522309401 },
  poloniex:
   { id: 127,
     last: '0.54000001',
     lowestAsk: '0.54314082',
     highestBid: '0.54000003',
     percentChange: '-0.06347552',
     baseVolume: '1353601.41228686',
     quoteVolume: '2394419.26895776',
     isFrozen: '0',
     high24hr: '0.58799997',
     low24hr: '0.54000010' },
  kraken:
   { a: [ '0.54118000', '33', '33.000' ],
     b: [ '0.54032000', '2664', '2664.000' ],
     c: [ '0.54120000', '15.19519520' ],
     v: [ '3783555.63449743', '6447316.87099599' ],
     p: [ '0.55409794', '0.56209874' ],
     t: [ 1657, 3473 ],
     l: [ '0.53920000', '0.53920000' ],
     h: [ '0.57400000', '0.58788000' ],
     o: '0.57239000' } }
```

### Send transaction
Sending a transaction for execution

```Javascript
var br = require('blockstarter-ripple');
var newAddress = br.pushTransaction('tx_blob', function(err, res){
  if (err != null) {
    throw err;
  }
  console.log(res);
});
```
