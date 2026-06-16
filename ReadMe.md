Technologies Used

Solidity: Smart contract development for ownership and access control.
React: Front-end interface for uploading images and managing access.
IPFS: Decentralized storage protocol for hosting uploaded images.

Usage

Installation

1. Install dependencies for the hardhat:

   # Navigate to the root directory
   cd Blockchain

   # Install  dependencies
   npm install
   npm install hardhat
   npm install express

2.Run the Blockchain Network
   # Run the Blockchain Network Locally
   npx hardhat node

3. Compile the smart contract for artifacts:
   # Compile Smart Contract
   npx hardhat compile

4. Deploy the Solidity smart contract to an Ethereum testnet or local development environment.

   # Deploy Smart Contract
   npx hardhat run scripts/deploy.js --network <network-name>

5.Run Node Server
   # Run the Express js node Server
   node server.js

6. Install dependencies for the React front end:

   # Navigate to the React client directory
    cd client 
   # Install React dependencies
   npm install

7. Run the react application:
   #Navigate to the client folder 
   #Start React Application
   npm start

Configuration

1. Set up environment variables:

   - Obtain API keys for Pinata to interact with IPFS.
   - Update the React component (FileUpload.js) with your Pinata API keys.
     
Usage

Once the setup and configuration are complete, follow these steps to utilize the decentralized image upload and sharing system:

1. Install Metamask:
      Ensure Metamask is installed and configured in your browser for Ethereum interactions.

2. Update Contract Address:
      After smart contract deployment, make sure to update the contract address in `App.js` within the React application.

3. Upload Image before "Get Data":
      Click "Get Data" only after uploading an image on Pinata. Otherwise, it will throw an error stating "You don't have access".



4. Accessing Other User Images:
      Use the "Get Data" button to access other users' images. Input the user's address in the designated box, but remember, you can only access their images if they've granted you access through the smart contract. Otherwise, it will throw an error saying "You don't have access".

5. File Access Expiry:
      Image access permissions are time-bound. Once access expires as per the smart contract conditions, you will no longer be able to retrieve the file.

6.  File Access Log:
      Every file access attempt is recorded on the blockchain, creating a transparent and immutable log of who accessed which file and when.


These steps will ensure smooth navigation and utilization of the system while maintaining access control and avoiding potential errors.


