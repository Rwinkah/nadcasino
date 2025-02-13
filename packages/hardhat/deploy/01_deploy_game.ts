import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the "Game" contract using the deployer account
 * and sets the trusted signer address as a constructor argument.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGame: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const trustedSigner = "0x1c07B848B69d0b435A80e84BAd6358251131d62d";
  await deploy("Game", {
    from: deployer,
    args: [trustedSigner], // Pass the trusted signer to the constructor
    log: true,
    autoMine: true,
  });

  const Game = await hre.ethers.getContract<Contract>("Game", deployer);
  console.log("🎯 Game deployed at:", Game.target);
  // console.log("Game is", Game);
};

export default deployGame;

deployGame.tags = ["Game"];
