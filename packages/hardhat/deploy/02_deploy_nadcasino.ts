import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, ethers } from "ethers";
import { parseUnits } from "ethers";

/**
 * Deploys the "Nadcasino" contract using the deployer account
 * and sets the trusted signer address as a constructor argument.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNadcasino: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const trustedSigner = "0x1c07B848B69d0b435A80e84BAd6358251131d62d";
  await deploy("Nadcasino", {
    from: deployer,
    args: [trustedSigner], // Pass the trusted signer to the constructor
    log: true,
    autoMine: true,
    gasPrice: parseUnits("50", "gwei"), // Increase if needed
  });

  const Nadcasino = await hre.ethers.getContract<Contract>("Nadcasino", deployer);
  console.log("🎯 Nadcasino deployed at:", Nadcasino.target);
  // console.log("Nadcasino is", Nadcasino);
};

export default deployNadcasino;

deployNadcasino.tags = ["Nadcasino"];
