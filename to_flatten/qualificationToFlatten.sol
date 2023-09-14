// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

abstract
contract IQLF is IERC165 {
    /**
     * @dev Check if the given address is qualified, implemented on demand.
     *
     * Requirements:
     *
     * - `account` account to be checked
     * - `data`  data to prove if a user is qualified.
     *           For instance, it can be a MerkelProof to prove if a user is in a whitelist
     *
     * Return:
     *
     * - `bool` whether the account is qualified for ITO
     * - `string` if not qualified, it contains the error message(reason)
     */
    function ifQualified (address account, bytes32[] memory data) virtual external view returns (bool, string memory);

    /**
     * @dev Logs if the given address is qualified, implemented on demand.
     */
    function logQualified (address account, bytes32[] memory data) virtual external returns (bool, string memory);

    /**
     * @dev Ensure that custom contract implements `ifQualified` amd `logQualified` correctly.
     */
    function supportsInterface(bytes4 interfaceId) virtual external override pure returns (bool) {
        return interfaceId == this.supportsInterface.selector || 
            interfaceId == (this.ifQualified.selector ^ this.logQualified.selector);
    }

    /**
     * @dev Emit when `logQualified` is called to decide if the given `address`
     * is `qualified` according to the preset rule by the contract creator and 
     * the current block `number` and the current block `timestamp`.
     */
    event Qualification(address indexed account, bool qualified, uint256 blockNumber, uint256 timestamp);
}


contract QLFFlat is IQLF, Ownable {
    uint256 public start_time;
    mapping(address => bool) black_list;

    function get_start_time() public view returns (uint256) {
        return start_time;
    }

    function set_start_time(uint256 _start_time) public onlyOwner {
        start_time = _start_time;
    }

    function ifQualified(address account, bytes32[] memory data)
        public
        pure
        override
        returns (
            bool qualified,
            string memory errorMsg
        )
    {
        return (true, "");
    }

    function logQualified(address account, bytes32[] memory data)
        public
        override
        returns (
            bool qualified,
            string memory errorMsg
        )
    {
        if (start_time > block.timestamp) {
            black_list[account] = true;
            return (false, "not started"); 
        }
        if (black_list[account]) {
            return (false, "blacklisted"); 
        }
        emit Qualification(account, true, block.number, block.timestamp);
        return (true, "");
    }

    function supportsInterface(bytes4 interfaceId) external override pure returns (bool) {
        return interfaceId == this.supportsInterface.selector || 
            interfaceId == (this.ifQualified.selector ^ this.logQualified.selector) ||
            interfaceId == this.get_start_time.selector;
    }    
}
