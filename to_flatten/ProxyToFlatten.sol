// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract SolidityProxyFlat is Proxy, Ownable {

    address public implementation;

    // Min proxy in solidity, use setter instead of constructor vars to allow verification on conflux
    // Setter, only can set this once
    function setImplementation(address impl) external onlyOwner {
        require(implementation == address(0));
        implementation = impl;
    }

    function _implementation() internal view override returns (address) {
        return implementation;
    }
}