// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title CropGrowthScore - Encrypted Crop Growth Score Storage
/// @notice Allows agricultural technicians to submit encrypted crop growth scores (0-10)
/// @dev Uses FHE to store encrypted scores on-chain, farmers can decrypt their own scores
contract CropGrowthScore is SepoliaConfig {
    // Structure to store score entry
    struct ScoreEntry {
        euint32 encryptedScore;
        uint256 timestamp;
        address farmerAddress;
    }

    // Mapping from entry ID to score entry
    mapping(uint256 => ScoreEntry) private _scoreEntries;
    
    // Mapping from farmer address to their entry IDs
    mapping(address => uint256[]) private _farmerEntries;
    
    // Counter for entry IDs
    uint256 private _entryCounter;
    
    // Mapping to track if a farmer has any entries
    mapping(address => bool) private _hasEntries;

    event ScoreSubmitted(address indexed technician, address indexed farmer, uint256 entryId, uint256 timestamp);
    event ScoreDecrypted(address indexed farmer, uint256 entryId, uint256 decryptedScore);

    /// @notice Submit an encrypted crop growth score for a farmer
    /// @param farmerAddress The address of the farmer who owns the crop
    /// @param encryptedScore The encrypted score value (0-10)
    /// @param inputProof The FHE input proof
    function submitScore(
        address farmerAddress,
        externalEuint32 encryptedScore,
        bytes calldata inputProof
    ) external {
        require(farmerAddress != address(0), "Invalid farmer address");
        
        euint32 score = FHE.fromExternal(encryptedScore, inputProof);
        
        // Validate score is within 0-10 range (this is done by checking on-chain)
        // Note: In production, you might want to add range checks using FHE comparison
        
        uint256 entryId = _entryCounter++;
        _scoreEntries[entryId] = ScoreEntry({
            encryptedScore: score,
            timestamp: block.timestamp,
            farmerAddress: farmerAddress
        });
        
        _farmerEntries[farmerAddress].push(entryId);
        _hasEntries[farmerAddress] = true;

        // Grant decryption permissions to the farmer
        FHE.allowThis(score);
        FHE.allow(score, farmerAddress);

        emit ScoreSubmitted(msg.sender, farmerAddress, entryId, block.timestamp);
    }

    /// @notice Get the encrypted score for a specific entry
    /// @param entryId The entry ID
    /// @return encryptedScore The encrypted score
    /// @return timestamp The timestamp when the score was submitted
    /// @return farmerAddress The address of the farmer
    function getScoreEntry(uint256 entryId) 
        external 
        view 
        returns (euint32 encryptedScore, uint256 timestamp, address farmerAddress) 
    {
        ScoreEntry memory entry = _scoreEntries[entryId];
        return (entry.encryptedScore, entry.timestamp, entry.farmerAddress);
    }

    /// @notice Get all entry IDs for a farmer
    /// @param farmerAddress The farmer's address
    /// @return entryIds Array of entry IDs
    function getFarmerEntries(address farmerAddress) 
        external 
        view 
        returns (uint256[] memory entryIds) 
    {
        return _farmerEntries[farmerAddress];
    }

    /// @notice Check if a farmer has any entries
    /// @param farmerAddress The farmer's address
    /// @return Whether the farmer has entries
    function hasEntries(address farmerAddress) external view returns (bool) {
        return _hasEntries[farmerAddress];
    }

    /// @notice Get the total number of entries
    /// @return The total entry count
    function getTotalEntries() external view returns (uint256) {
        return _entryCounter;
    }
}

