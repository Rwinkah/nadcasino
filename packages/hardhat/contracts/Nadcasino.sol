// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Nadcasino is Ownable {
    address public trustedSigner; // Backend's trusted signer
    uint256 public plinkoCollisionCount;
    mapping(address => uint256) public PlinkoCollision;
    mapping(address => uint256) public highScores;
    uint256 public molandakJumpCount;

    event molandakJump(address player, uint256 jumpCount);
    event molandakNewHighScore(address player, uint256 score);
    event plinkoCollision(uint256 collisionCount, address player);
    event Payout(address indexed player, uint256 amount);
    event BetPlaced(address indexed player, uint256 amount, uint256 timestamp, uint256 nonce);

    constructor(address _trustedSigner) Ownable(msg.sender) {
        trustedSigner = _trustedSigner;
        transferOwnership(msg.sender);
    }

    function _verifySignature(bytes32 messageHash, bytes memory signature) internal view returns (bool) {
        address signer = trustedSigner;
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

    function updateTrustedSigner(address newSigner) external onlyOwner {
        trustedSigner = newSigner;
    }

    function plinkoReportCollision(address player) public {
        plinkoCollisionCount++;
        PlinkoCollision[player]++;
        emit plinkoCollision(plinkoCollisionCount, player);
    }

    function molandakrunSetHighscore(uint256 score, address player) external onlyOwner {
        uint256 currentScore = highScores[player];
        if (score > currentScore) {
            highScores[player] = score;
            emit molandakNewHighScore(player, score);
        }
    }

    function molandakReportJump(address player) public {
        molandakJumpCount++;
        emit molandakJump(player, molandakJumpCount);
    }

    receive() external payable {}
}
