# Hardhat Fund Me

## Overview
This project is a decentralized application (DApp) built with **Hardhat** and **Ethereum**, demonstrating a simple crowdfunding smart contract. Users can fund the contract with ETH, and the contract owner can withdraw the collected funds. The project also integrates **Chainlink Price Feeds** to convert ETH to USD, ensuring funding meets a minimum USD amount.

## Features
- Deploy smart contracts on local and test networks using Hardhat.
- Accept ETH contributions from multiple users.
- Withdraw funds only by the contract owner.
- Real-time ETH/USD conversion using Chainlink Price Feeds.
- Unit tests with Hardhat and Chai to ensure contract functionality.

## Technologies
- [Hardhat](https://hardhat.org/) – Ethereum development environment
- [Solidity](https://soliditylang.org/) – Smart contract language
- [Ethers.js](https://docs.ethers.io/) – Interact with Ethereum network
- [Chainlink](https://chain.link/) – Decentralized oracle for price feeds
- [Mocha & Chai](https://mochajs.org/) – Testing framework
