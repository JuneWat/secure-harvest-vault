import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { CropGrowthScore } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  technician: HardhatEthersSigner;
  farmer: HardhatEthersSigner;
};

describe("CropGrowthScoreSepolia", function () {
  let signers: Signers;
  let cropGrowthScoreContract: CropGrowthScore;
  let cropGrowthScoreContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const CropGrowthScoreDeployment = await deployments.get("CropGrowthScore");
      cropGrowthScoreContractAddress = CropGrowthScoreDeployment.address;
      cropGrowthScoreContract = await ethers.getContractAt(
        "CropGrowthScore",
        CropGrowthScoreDeployment.address,
      );
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      technician: ethSigners[0],
      farmer: ethSigners[1],
    };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should submit and decrypt a score", async function () {
    steps = 8;

    this.timeout(4 * 40000);

    const clearScore = 7;

    progress(`Encrypting score '${clearScore}'...`);
    const encryptedScore = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(clearScore)
      .encrypt();

    progress(
      `Call submitScore() CropGrowthScore=${cropGrowthScoreContractAddress} handle=${ethers.hexlify(encryptedScore.handles[0])} farmer=${signers.farmer.address}...`,
    );
    const tx = await cropGrowthScoreContract
      .connect(signers.technician)
      .submitScore(signers.farmer.address, encryptedScore.handles[0], encryptedScore.inputProof);
    await tx.wait();

    progress(`Call getTotalEntries()...`);
    const totalEntries = await cropGrowthScoreContract.getTotalEntries();
    expect(totalEntries).to.be.gt(0);

    progress(`Get farmer entries...`);
    const farmerEntries = await cropGrowthScoreContract.getFarmerEntries(signers.farmer.address);
    expect(farmerEntries.length).to.be.gt(0);

    const entryId = farmerEntries[farmerEntries.length - 1];
    progress(`Get score entry ${entryId}...`);
    const [encryptedScoreFromContract, timestamp, farmerAddress] =
      await cropGrowthScoreContract.getScoreEntry(entryId);

    expect(farmerAddress).to.eq(signers.farmer.address);
    expect(timestamp).to.be.gt(0);

    progress(`Decrypting score entry ${entryId}...`);
    const decryptedScore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedScoreFromContract,
      cropGrowthScoreContractAddress,
      signers.farmer,
    );
    progress(`Decrypted score: ${decryptedScore}`);

    expect(decryptedScore).to.eq(clearScore);
  });
});

