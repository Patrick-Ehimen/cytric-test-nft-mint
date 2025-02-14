import { Router } from "express";
import {
  storeNFT,
  getNFTById,
  getNFTGallery,
} from "../controllers/nft.controller";

const router = Router();

/**
 * @swagger
 * /api/nft:
 *   post:
 *     summary: Store NFT data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nftId:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               userWalletAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: NFT data stored successfully
 */
router.post("/nft", storeNFT);

/**
 * @swagger
 * /api/nft/{id}:
 *   get:
 *     summary: Get NFT data by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: NFT ID
 *     responses:
 *       200:
 *         description: NFT data retrieved successfully
 *       404:
 *         description: NFT not found
 */
router.get("/nft/:id", getNFTById);

/**
 * @swagger
 * /api/nft/gallery/{userWalletAddress}:
 *   get:
 *     summary: Get NFT gallery by user wallet address
 *     parameters:
 *       - in: path
 *         name: userWalletAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: User Wallet Address
 *     responses:
 *       200:
 *         description: List of NFT data objects retrieved successfully
 */
router.get("/nft/gallery/:userWalletAddress", getNFTGallery);

export default router;
