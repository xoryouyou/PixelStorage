# PixelStorage
Ever wanted to buy a pixel on a blockchain ?!

You can do so now!

Head over to: http://pixels.ermahgerd.wtf/

![tests](https://user-images.githubusercontent.com/777569/50079384-cb388f00-01e9-11e9-9f79-d3c22660260c.png)
![screenshot](https://user-images.githubusercontent.com/777569/50079302-8d3b6b00-01e9-11e9-8f19-21ffcc78b4c6.png)


## FAQ

### Whats the contract address ?

* https://etherscan.io/address/0x004e702aa7e3850f7da045f65da3218059b09381
  
### How many pixels are there
* 512*512 -> 262144 to be precise

### Whats the minimum price ?
* 1 finney or 0.001 ETH

### How can I buy an already owned pixel ?
* Yes you can just make sure to send a 1 finney higher price then the current price


## Development

1. `npm install`
2. start a local chain `truffle develop`
3. migrate contracts `truffle migrate`
4. add `PixelStorage` contract address in `main.js`
   1. ` app.setPixelStorage("0x12345....");
5. start local dev server `npm run dev`
