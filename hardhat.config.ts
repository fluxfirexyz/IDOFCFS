import { ethers } from 'ethers'
const chai = require('chai')
const expect = chai.expect;
const assert = chai.assert
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "solidity-coverage"
import "hardhat-gas-reporter"

const {
    infura_project_id,
    private_key_list,
} = require('./project.secret');

const networks = {
    localhost: {
        url: "http://127.0.0.1:8545",
        chainId: 1337,
    },
    hardhat: {
        blockGasLimit: 6000000,
        chainId: 31337,
        gas: 'auto',
    },
    ropsten: {
        url: 'https://ropsten.infura.io/v3/' + infura_project_id,
        accounts: private_key_list,
        chainId: 3,
        // 10gwei make test faster
        gasPrice: ethers.utils.parseUnits('10', 'gwei').toNumber(),
        // blockGasLimit 8000000
    },
    bsc_test: {
        url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        accounts: private_key_list,
        chainId: 97,
        // 25 Gwei, if too low, we would see "ProviderError: transaction underpriced"
        gasPrice: 25000000000,
        // blockGasLimit 8000000
    },
    // BSC mainnet not tested yet, not sure if it works
    bsc_mainnet: {
        url: 'https://bsc-dataseed1.binance.org:443',
        accounts: private_key_list,
        chainId: 56,
        // 5 Gwei
        gasPrice: 5000000000,
        // blockGasLimit 8000000
    },
    matic_mumbai_test: {
        url: 'https://rpc-mumbai.maticvigil.com',
        accounts: private_key_list,
        chainId: 80001,
        gasPrice: ethers.utils.parseUnits('10', 'gwei').toNumber(),
        // blockGasLimit 8000000
    },
    matic_mainnet: {
        url: 'https://rpc-mainnet.matic.network',
        accounts: private_key_list,
        chainId: 137,
        gasPrice: ethers.utils.parseUnits('10', 'gwei').toNumber(),
        // blockGasLimit 8000000
    },
};


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks,
    mocha: {
        timeout: 500000
    },
    solidity: "0.8.0",
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    gasReporter: {
        currency: 'USD',
        gasPrice: 21,
        enabled: true,
    },
};
