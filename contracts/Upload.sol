// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Upload {
    mapping(address => string[]) private files;
    mapping(address => mapping(address => bool)) private accessList; // Store shared access permissions

    // Store encrypted file hash
    function add(address user, string memory encryptedHash) public {
        files[user].push(encryptedHash);
    }

    // Grant access to another user
    function allow(address user) public {
        accessList[msg.sender][user] = true;
    }

    // Retrieve files (Uploader or Shared User can access)
    // Function to retrieve files (Uploader OR Shared Users can access)
    function display(address user) public view returns (string[] memory) {
    // Ensure uploader always has access to their own files
    if (msg.sender == user || accessList[user][msg.sender]) {
        return files[user];
    } else {
        revert("Access Denied");
    }
}


    // Check if a user has access
    function checkAccess(address owner, address user) public view returns (bool) {
        return accessList[owner][user];
    }
}
