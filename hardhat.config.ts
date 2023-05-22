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
import '@openzeppelin/hardhat-upgrades'
import "@nomiclabs/hardhat-etherscan";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        version: "0.8.17"
    }
};
