// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import "./IQLF.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract QLF is IQLF, Ownable {
    bytes32 public merkleRoot;
    uint public startTime;

    constructor (uint256 _startTime, bytes32 _merkleRoot) {
        startTime = _startTime;
        merkleRoot = _merkleRoot;
    }

    function setStartTime(uint256 _startTime) public onlyOwner {
        _startTime = _startTime;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function ifQualified(address account, bytes32[] memory data)
        public
        view
        override
        returns (
            bool qualified,
            string memory errorMsg
        )
    {
        return (MerkleProof.verify(data, merkleRoot, bytes32(uint256(uint160(account)))), "");
    }

    function logQualified(address account, bytes32[] memory data)
        public
        override
        returns (
            bool qualified,
            string memory errorMsg
        )
    {
        return (MerkleProof.verify(data, merkleRoot, bytes32(uint256(uint160(account)))), "");
    }

    function supportsInterface(bytes4 interfaceId) external override pure returns (bool) {
        return interfaceId == this.supportsInterface.selector || 
            interfaceId == (this.ifQualified.selector ^ this.logQualified.selector) ||
            interfaceId == this.startTime.selector;
    }    
}
