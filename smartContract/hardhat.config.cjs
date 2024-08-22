const { solidity } = require("ethereum-waffle");

//https://eth-sepolia.g.alchemy.com/v2/ev9zrAlregKDb7FEjrAK0g9dNqN5MRwZ
require("@nomiclabs/hardhat-waffle"); //hardhat plugin to write SC test

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ev9zrAlregKDb7FEjrAK0g9dNqN5MRwZ",
      account: [
        "19b1bc96522f75f23435df27c84cfcb9200934ebb5f8957e80802255c2d4d92f",
      ],
    },
  },
};
