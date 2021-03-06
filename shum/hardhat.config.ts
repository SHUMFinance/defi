import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/types";

require('@nomiclabs/hardhat-ethers')


const config: HardhatUserConfig = {

  networks: {
    
    eth: {
        url: `https://kovan.infura.io/v3/7e31d49d7c8a48f4a4539aff9da768e7`,
        accounts: [
          "0xb284728d5b798fac1282540aa8d13ac168393814f9181f51e4736d1e786b896f",
          "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc",
          "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
        ]
    },

    bsc: {
      url: `https://data-seed-prebsc-2-s1.binance.org:8545`,
      accounts: [
        "0xb284728d5b798fac1282540aa8d13ac168393814f9181f51e4736d1e786b896f",
        "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc",
        "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
      ]
    },

    my2: {
      url: `http://localhost:6111`,
      accounts: [
        "0xb284728d5b798fac1282540aa8d13ac168393814f9181f51e4736d1e786b896f",
        "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc",
        "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
      ]
    },

    hardhat: {
      chainId:100,
      accounts: [
        {privateKey:"0xb284728d5b798fac1282540aa8d13ac168393814f9181f51e4736d1e786b896f",balance:"10000000000000000000000"},
        {privateKey:"0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc",balance:"10000000000000000000000"},
        {privateKey:"0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",balance:"10000000000000000000000"},
        {privateKey:"0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",balance:"10000000000000000000000"}
      ]
    }

  },

  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          evmVersion: "istanbul",
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          evmVersion: "istanbul",
        },
      },
    ],
  },
  paths: {
    tests: "./tests",
  },

};

export default config;


