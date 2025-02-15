# NFT Minting Frontend

This repository contains the frontend code for the NFT Minting application. The application allows users to mint new NFTs and view their NFT gallery. The frontend interacts with the deployed API and the smart contract on the Sepolia network.

---

## API Routes

The following API routes are used by the frontend:

- **Store NFT Data:**  
  `POST /api/nft`  
  _Stores NFT metadata (name, description, logo URL, NFT ID, and user wallet address) in the backend database._

- **Get NFT Data By ID:**  
  `GET /api/nft/:id`  
  _Retrieves the NFT metadata for a given NFT ID._

- **Get NFT Gallery:**  
  `GET /api/nft/gallery/:walletAddress`  
  _Retrieves a list of NFTs owned by the specified wallet address._

---

## Deployed API

The API is deployed at:  
[Render](https://nft-mint-deployment.onrender.com/)

---

## Deployed Frontend

The frontend is deployed at:  
[https://nft-frontend-demo.vercel.app](https://nft-mint-zeta-two.vercel.app/)

---

## Loom Video Demos

Here are some Loom video demos that showcase the application's functionality:

- [NFT Minting Demo Part 1](https://www.loom.com/share/f0fa785ca15e4a618918e656f5390a6d?sid=3c513dcc-f4b6-4cd4-814f-7fa32238f8a8)
- [NFT Gallery Demo](https://www.loom.com/share/f0fa785ca15e4a618918e656f5390a6d?sid=3c513dcc-f4b6-4cd4-814f-7fa32238f8a8)

---

## Backend Repository

The backend code for this application is available at:  
[Project Backend](https://github.com/Patrick-Ehimen/cytric-test-nft-mint/tree/main/backend)
