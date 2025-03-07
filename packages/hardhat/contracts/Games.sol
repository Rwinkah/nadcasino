// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    address public owner; // Admin for security
    address public trustedSigner; // Backend's trusted signer
    mapping(address => uint256) public latestNonce; // Tracks the latest nonce per user
    uint256 public collisionCount;

    event Collision(uint256 collisionCount, address player);
    event Payout(address indexed player, uint256 amount);
    event BetPlaced(address indexed player, uint256 amount, uint256 timestamp, uint256 nonce);

    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
        owner = msg.sender;
    }

    function placeBet(uint256 amount, uint256 timestamp, uint256 nonce, bytes memory signature) external payable {
        require(msg.value == amount, "Sent ETH does not match the bet amount");
        require(nonce == latestNonce[msg.sender] + 1, "Invalid nonce"); // Prevent replay attacks

        // Verify signature includes nonce
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, amount, timestamp, nonce));
        require(_verifySignature(messageHash, signature), "Invalid signature");

        latestNonce[msg.sender] = nonce; // ✅ Update nonce

        emit BetPlaced(msg.sender, amount, timestamp, nonce);
    }

    function _verifySignature(bytes32 messageHash, bytes memory signature) internal view returns (bool) {
        address signer = trustedSigner; // Store trusted signer in memory
        bytes32 ethSignedMessageHash = _getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    function _getEthSignedMessageHash(bytes32 messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function updateTrustedSigner(address newSigner) external {
        require(msg.sender == owner, "Only owner can update signer");
        trustedSigner = newSigner;
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner can transfer ownership");
        owner = newOwner;
    }

    function reportCollision() public {
        collisionCount++;
        emit Collision(collisionCount, msg.sender);
    }

    receive() external payable {}
}
