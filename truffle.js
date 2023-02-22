const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
console.log(`${process.env.INFURA_KEY} || ${process.env.ALCHEMY_KEY}`)
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;

console.log('RUN DEBUG', {MNEMONIC, NODE_API_KEY, isInfura})

const needsNodeAPI =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("rinkeby") ||
    process.env.npm_config_argv.includes("live"));

if ((!MNEMONIC || !NODE_API_KEY) && needsNodeAPI) {
  console.error("Please set a mnemonic and ALCHEMY_KEY or INFURA_KEY.");
  process.exit(0);
}

const rinkebyNodeUrl = isInfura
  ? "https://rinkeby.infura.io/v3/" + NODE_API_KEY
  : "https://eth-rinkeby.alchemyapi.io/v2/" + NODE_API_KEY;

const mainnetNodeUrl = isInfura
  ? "https://mainnet.infura.io/v3/" + NODE_API_KEY
  : "https://eth-mainnet.alchemyapi.io/v2/" + NODE_API_KEY;


const goerliNodeUrl = isInfura
  ? "https://goerli.infura.io/v3/" + NODE_API_KEY
  : "https://eth-goerli.g.alchemy.com/v2/" + NODE_API_KEY;


module.exports = {
  networks: {
    // development: {
    //   host: "localhost",
    //   port: 7545,
    //   gas: 5000000,
    //   network_id: "*", // Match any network id
    // },
    rinkeby: {
      provider: function () {
        console.log('RUN 2 ', rinkebyNodeUrl)
        return new HDWalletProvider(MNEMONIC, rinkebyNodeUrl);
      },
      gas: 5000000,
      network_id: 4,
    },
    goerli: {
      network_id: 5,
      provider: function () {
        console.log('RUN 1 ', goerliNodeUrl)
        return new HDWalletProvider(MNEMONIC, goerliNodeUrl);
      },
      networkCheckTimeout: 9000000000,
      gas: 5000000,
    },
    live: {
      network_id: 1,
      provider: function () {
        return new HDWalletProvider(MNEMONIC, mainnetNodeUrl);
      },
      gas: 5000000,
      gasPrice: 5000000000,
    },
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 2,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 20   // Optimize for how many times you intend to run the code
        },
      },
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'ETHERSCAN_API_KEY_FOR_VERIFICATION'
  }
};
