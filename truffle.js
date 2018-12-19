var mainnet_address = "0x004e702aa7e3850f7da045f65da3218059b09381";

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'EUR',
      gasPrice: 5

    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    }
  }
};
