// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FirefluxTestToken is ERC20 {
    constructor() ERC20("FirefluxTestToken", "FTT") {}

    function mint(address _account, uint256 _amount) external {
        _mint(_account, _amount);
    }
}