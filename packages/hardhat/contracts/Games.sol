// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    address public trustedSigner; // Backend's trusted signer
    mapping(address => uint256) public latestNonce; // Tracks the latest nonce per user
    uint256 public collisionCount;

    event Collision(uint256 collisionCount, address player);

    event Payout(address indexed player, uint256 amount);

    constructor(address _trustedSigner) {
        trustedSigner = _trustedSigner;
    }

    // function playGame(bytes memory signature) external {
    //     require(nonce > latestNonce[player], "Invalid or reused nonce");

    //     // Verify the signature
    //     bytes32 messageHash = keccak256(abi.encodePacked(player, amount, nonce));
    //     require(_verifySignature(messageHash, signature), "Invalid signature");

    //     latestNonce[player] = nonce; // Update nonce after successful verification

    //     require(address(this).balance >= amount, "Insufficient contract balance");
    //     (bool success, ) = player.call{ value: amount }("");
    //     require(success, "Transfer failed");

    //     emit Payout(player, amount);
    // }
    function _extractSignedData(
        bytes memory signature
    ) internal pure returns (address player, uint256 amount, uint256 nonce) {
        require(signature.length >= 97, "Invalid signature data"); // 65 for signature + 32 for data
        assembly {
            player := mload(add(signature, 20))
            amount := mload(add(signature, 52))
            nonce := mload(add(signature, 84))
        }
    }

    function playGame(bytes memory signature) external {
        (address player, uint256 amount, uint256 nonce) = _extractSignedData(signature);

        require(nonce > latestNonce[player], "Invalid or reused nonce");

        // Verify the signature
        bytes32 messageHash = keccak256(abi.encodePacked(player, amount, nonce));
        require(_verifySignature(messageHash, signature), "Invalid signature");

        latestNonce[player] = nonce; // Update nonce after successful verification

        require(address(this).balance >= amount, "Insufficient contract balance");
        (bool success, ) = player.call{ value: amount }("");
        require(success, "Transfer failed");

        emit Payout(player, amount);
    }

    function _verifySignature(bytes32 messageHash, bytes memory signature) internal view returns (bool) {
        bytes32 ethSignedMessageHash = _getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == trustedSigner;
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

    // Admin function to update the trusted signer
    function updateTrustedSigner(address newSigner) external {
        require(msg.sender == trustedSigner, "Only current signer can update");
        trustedSigner = newSigner;
    }

    function reportCollision() public {
        // require(msg.sender == trustedSigner, "Who are you?");
        collisionCount++;
        emit Collision(collisionCount, msg.sender);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
