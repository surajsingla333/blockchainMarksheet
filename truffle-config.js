var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "rate shed thrive release flee basket dust foil horror gain monitor draft"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'rinkeby.infura.io/v3/15c57f3c86d74820a7fcc062da9038eb'),
      network_id: 4,    // Rinkeby's id
      gas: 5500000,    // Ropsten has a lower block limit than mainnet
      confirmations: 2,  // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out (minimum/default: 50)
      skipDryRun: true   // Skip dry run before migrations? (default: false for public nets )
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/15c57f3c86d74820a7fcc062da9038eb'),
      network_id: 3,    // Rinkeby's id
      // gas: 5500000,    // Ropsten has a lower block limit than mainnet
      confirmations: 2,  // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200, // # of blocks before a deployment times out (minimum/default: 50)
      // skipDryRun: true   // Skip dry run before migrations? (default: false for public nets )
    }
  }
};

