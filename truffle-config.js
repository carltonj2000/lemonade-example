const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.4.25" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  },
  networks: {
    truffledevelop: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ganachecli: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganachegui: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          secrets.rinkeby.mnemonic,
          secrets.rinkeby.rpcServer
        );
      },
      network_id: "4", // Rinkeby ID 4
      gas: 4500000,
      gasPrice: 10000000000
    }
  }
};
