# InitialTwitterOffering

## Introduction

Initial Twitter Offering (ITO) is a Dapplet based on the Mask browser extension. It consists of two components, the browser extension and the Ethereum smart contract. This repo covers the design and the implementation of the smart contract only.

## Overview

ITO is basically a token swap pool that can be initiated by any Ethereum user. Users can transfer an amount of a target token (now supporting ETH and ERC20 tokens) into the pool and set the swap ratios, e.g. {1 ETH: 10000 TOKEN, 1 DAI: 10 TOKEN}. Users can also set the swap limit (ceiling) to control how many tokens to be swapped by a single address, e.g. 10000 TOKEN. After the pool is expired (also set on initiation) or the target token is out of stock, the pool creator can withdraw any target token left and all the swapped tokens. The pool will be destructed after the withdraw.

Participants only need to approve one of the specified tokens according to the `pool ratio` and call the `swap()` function to swap the target token out. The swapped amount is automatically calculated by the smart contract and the users can receive the target token instantly after a successful call of the `swap()`. Pool creator can also set an unlock time for ITO which means to receive the target token participants need to wait after that unlock time by calling `claim()` function.

## Getting Started

This is a standard truffle project.
To install:

```bash
npm ci
```

To build the project:

```bash
npm run compile
```

To test the project:

```bash
npm test
```

To deploy contract on `ropsten`:

```bash
npm run deploy ropsten
```

To debug:

```solidity
//...
import "hardhat/console.sol";

function debug_param (address _token_addr) public {
    console.log('_token_addr', _token_addr);
}
```

## Deployed Contract

### ITO Contract

The ITO smart contract adopts the `Proxy Upgrade Pattern` to improve user experience. Hence, the addresses in later section are actually the deployed `TransparentUpgradeableProxy` smart contract addresses.

### Qualification

Another smart contract interface `IQLF` ([source code](https://github.com/DimensionDev/InitialTwitterOffering/blob/master/contracts/IQLF.sol)) is also introduced to provide an API `logQualified()` that returns a boolean indicating if the given address is qualified. Custom qualification contract **SHOULD** implement contract `IQLF` rather than ERC-165 to further ensure the required interface is implemented since `IQLF` is compliant with ERC-165 and has implemented the details of `supportsInterface` function.

To prevent a malicious attack, you can set a `swap_start_time` in your custom qualification contract, then add accounts who swap before that time to a blacklist, they will no longer be able to access your ITO. Please confirm the `swap_start_time` carefully, it must be less than the end time of ITO, otherwise, nobody can access your ITO at all. To let Mask browser extension help you check if `swap_start_time` is less than the end time of ITO. You need to append `interfaceId == this.get_start_time.selector;` to `supportsInterface()`(Notice the getter function **MUST** be named `get_start_time()` to keep the same with the browser extension code), just copy the implementation of [our default qualification contract](https://github.com/DimensionDev/InitialTwitterOffering/blob/master/contracts/qualification.sol).

### Contract Addresses

Test ERC20s: 0xeeb24e981d195c4d9806e7bd8877e9bcaf0d6aa6, 0xeeb24e981d195c4d9806e7bd8877e9bcaf0d6aa6
MerkleQualificationFlat: 0x95ad1dd98f0f8cda4d8fa711b1bbf6fde35e6701
Implementation (HappyTokenPoolFlat): 
Proxy (SolidityProxyFlat): 0x014643658034ad7f202bfd00d01748d784ce0cdc

<!-- end address -->

### Implementation block number (required by frontend developers)

<!-- begin block -->


<!-- end block -->

## Security Audit

The Solidity code in this repository has been audited by blockchain security experts from SlowMist. If you are interested, here are the audit reports:

- [Audit Report](audits/SlowMist_Audit_Report_English.pdf)
- [审计报告](audits/SlowMist_Audit_Report_Chinese.pdf)

If you have any security issue to report, please send to <security@mask.io>.

## Contribute

Any contribution is welcomed to make it more secure and powerful. Had you any questions, please do not hesitate to create an issue to let us know.

## License

InitialTwitterOffering is released under the [MIT LICENSE](LICENSE).
