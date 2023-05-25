// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

contract ProxyFactory {

    event ProxyDeployed(address clone);

    function deploy(address _impl) external {
        emit ProxyDeployed(Clones.clone(_impl));
    }
}