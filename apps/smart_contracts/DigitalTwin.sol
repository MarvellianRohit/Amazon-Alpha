// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigitalTwin is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from tokenId to Product ID (DB UUID)
    mapping(uint256 => string) public productIds;

    // Resale Listing: tokenId -> Price (Wei)
    mapping(uint256 => uint256) public resalePrices;
    
    // Royalty percentage (Basis points: 200 = 2%)
    uint256 public constant ROYALTY_BPS = 200;
    address public vendorWallet; // Simplified: Single vendor for this demo contract

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string productId);
    event ListedForResale(uint256 indexed tokenId, uint256 price);
    event ResaleCompleted(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    constructor(address initialOwner, address _vendorWallet)
        ERC721("AmazonAlphaTwin", "AMZ-TWIN")
        Ownable(initialOwner)
    {
        vendorWallet = _vendorWallet;
    }

    function mint(address to, string memory productId, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        productIds[tokenId] = productId;
        emit NFTMinted(tokenId, to, productId);
    }

    // --- Resale Logic ---

    function listForResale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        
        // Escrow logic: In real app, we might transfer to contract, 
        // but for simplicity we just mark it listed. 
        // To be safe, user must approve contract to transfer.
        resalePrices[tokenId] = price;
        emit ListedForResale(tokenId, price);
    }

    function buyResale(uint256 tokenId) public payable {
        uint256 price = resalePrices[tokenId];
        require(price > 0, "Not for sale");
        require(msg.value >= price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        
        // Calculate Royalty
        uint256 royaltyAmount = (price * ROYALTY_BPS) / 10000;
        uint256 sellerAmount = price - royaltyAmount;

        // Reset listing
        resalePrices[tokenId] = 0;

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Payout
        payable(vendorWallet).transfer(royaltyAmount);
        payable(seller).transfer(sellerAmount);

        emit ResaleCompleted(tokenId, seller, msg.sender, price);
    }

    // --- Overrides ---

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
