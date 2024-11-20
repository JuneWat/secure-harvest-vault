import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { CropGrowthScore, CropGrowthScore__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  technician: HardhatEthersSigner;
  farmer: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("CropGrowthScore")) as CropGrowthScore__factory;
  const cropGrowthScoreContract = (await factory.deploy()) as CropGrowthScore;
  const cropGrowthScoreContractAddress = await cropGrowthScoreContract.getAddress();

  return { cropGrowthScoreContract, cropGrowthScoreContractAddress };
}

describe("CropGrowthScore", function () {
  let signers: Signers;
  let cropGrowthScoreContract: CropGrowthScore;
  let cropGrowthScoreContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      technician: ethSigners[1],
      farmer: ethSigners[2],
    };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ cropGrowthScoreContract, cropGrowthScoreContractAddress } = await deployFixture());
  });

  it("should have no entries initially", async function () {
    const totalEntries = await cropGrowthScoreContract.getTotalEntries();
    expect(totalEntries).to.eq(0);

    const hasEntries = await cropGrowthScoreContract.hasEntries(signers.farmer.address);
    expect(hasEntries).to.eq(false);
  });

  it("should submit an encrypted score", async function () {
    const clearScore = 7;
    const encryptedScore = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(clearScore)
      .encrypt();

    const tx = await cropGrowthScoreContract
      .connect(signers.technician)
      .submitScore(signers.farmer.address, encryptedScore.handles[0], encryptedScore.inputProof);
    await tx.wait();

    const totalEntries = await cropGrowthScoreContract.getTotalEntries();
    expect(totalEntries).to.eq(1);

    const hasEntries = await cropGrowthScoreContract.hasEntries(signers.farmer.address);
    expect(hasEntries).to.eq(true);

    const farmerEntries = await cropGrowthScoreContract.getFarmerEntries(signers.farmer.address);
    expect(farmerEntries.length).to.eq(1);
    expect(farmerEntries[0]).to.eq(0);
  });

  it("should retrieve and decrypt submitted score", async function () {
    const clearScore = 8;
    const encryptedScore = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(clearScore)
      .encrypt();

    const tx = await cropGrowthScoreContract
      .connect(signers.technician)
      .submitScore(signers.farmer.address, encryptedScore.handles[0], encryptedScore.inputProof);
    await tx.wait();

    const entryId = 0;
    const [encryptedScoreFromContract, timestamp, farmerAddress] =
      await cropGrowthScoreContract.getScoreEntry(entryId);

    expect(farmerAddress).to.eq(signers.farmer.address);
    expect(timestamp).to.be.gt(0);

    // Decrypt the score
    const decryptedScore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedScoreFromContract,
      cropGrowthScoreContractAddress,
      signers.farmer,
    );

    expect(decryptedScore).to.eq(clearScore);
  });

  it("should allow multiple scores for the same farmer", async function () {
    const score1 = 6;
    const encryptedScore1 = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(score1)
      .encrypt();

    let tx = await cropGrowthScoreContract
      .connect(signers.technician)
      .submitScore(signers.farmer.address, encryptedScore1.handles[0], encryptedScore1.inputProof);
    await tx.wait();

    const score2 = 9;
    const encryptedScore2 = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(score2)
      .encrypt();

    tx = await cropGrowthScoreContract
      .connect(signers.technician)
      .submitScore(signers.farmer.address, encryptedScore2.handles[0], encryptedScore2.inputProof);
    await tx.wait();

    const totalEntries = await cropGrowthScoreContract.getTotalEntries();
    expect(totalEntries).to.eq(2);

    const farmerEntries = await cropGrowthScoreContract.getFarmerEntries(signers.farmer.address);
    expect(farmerEntries.length).to.eq(2);
    expect(farmerEntries[0]).to.eq(0);
    expect(farmerEntries[1]).to.eq(1);

    // Decrypt both scores
    const [encryptedScore1FromContract] = await cropGrowthScoreContract.getScoreEntry(0);
    const decryptedScore1 = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedScore1FromContract,
      cropGrowthScoreContractAddress,
      signers.farmer,
    );
    expect(decryptedScore1).to.eq(score1);

    const [encryptedScore2FromContract] = await cropGrowthScoreContract.getScoreEntry(1);
    const decryptedScore2 = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedScore2FromContract,
      cropGrowthScoreContractAddress,
      signers.farmer,
    );
    expect(decryptedScore2).to.eq(score2);
  });

  it("should reject zero address as farmer", async function () {
    const clearScore = 5;
    const encryptedScore = await fhevm
      .createEncryptedInput(cropGrowthScoreContractAddress, signers.farmer.address)
      .add32(clearScore)
      .encrypt();

    await expect(
      cropGrowthScoreContract
        .connect(signers.technician)
        .submitScore(ethers.ZeroAddress, encryptedScore.handles[0], encryptedScore.inputProof),
    ).to.be.revertedWith("Invalid farmer address");
  });
});

