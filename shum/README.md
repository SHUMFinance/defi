# shum Finance

Smart contracts implemented in Solidity for shum Finance.

## Introduction

shum Finance is a cross-chain compatible, decentralized delta-one asset protocol to cost-effectively and instantly create, manage, and trade synthetic assets with unlimited liquidity.

shum Finance ("shum") is a non-custodial, cross-chain compatible, delta-one asset protocol. shum's long term DeFi vision is to increase inclusiveness and democratize access to investment assets (digital and traditional). Tremendous value exists in the ability for investors to easily and quickly invest, save fees, and secure assets at fair market value. shum combines substantial technical experience from numerous crypto projects with extensive financial experience in exotic and structured assets from traditional global asset management firms to bring to market one of the first DeFi projects built upon Ethereum with cross-chain compatibility. shum will allow users to build and manage spot or portfolio exposures with a slew of innovative digital and traditional financial products.

## Prerequisite

A recent version of [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) are required to compile the contracts and run tests.

## Compiling

Build the smart contracts using [Hardhat](https://hardhat.org/) with the following command:

```sh
$ yarn install
$ yarn compile
```

You can find compiled contracts in the `./artifacts` folder upon successful compilation.

## Testing

Run test cases with [Hardhat](https://hardhat.org/):

```sh
$ yarn test
```

## License

All code in this repository is licensed under [MIT](./LICENSE).
