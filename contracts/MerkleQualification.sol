// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import "./IQLF.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleQualification is IQLF, Ownable {
    bytes32 public merkleRoot;

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
        return (MerkleProof.verify(data, merkleRoot, doubleHash(account)), "");
    }

    function logQualified(address account, bytes32[] memory data)
        public
        override
        view
        returns (
            bool qualified,
            string memory errorMsg
        )
    {
        return (MerkleProof.verify(data, merkleRoot, doubleHash(account)), "");
    }

    function doubleHash(address a) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(keccak256(abi.encodePacked(a))));
    }

    function supportsInterface(bytes4 interfaceId) external override pure returns (bool) {
        return interfaceId == this.supportsInterface.selector || 
            interfaceId == (this.ifQualified.selector ^ this.logQualified.selector);
    }    
}
