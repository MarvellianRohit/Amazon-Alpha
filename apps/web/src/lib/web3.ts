import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Digital Twin Contract ABI (Simplified for Demo)
export const DIGITAL_TWIN_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "string", "name": "productId", "type": "string" },
            { "internalType": "string", "name": "uri", "type": "string" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

// Helper to get client
export const getWalletClient = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        const client = createWalletClient({
            chain: sepolia, // Default to Sepolia for dev
            transport: custom((window as any).ethereum),
        });
        return client;
    }
    return null;
};

export const getPublicClient = () => {
    return createPublicClient({
        chain: sepolia,
        transport: http(),
    });
};

export const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
            const accounts = await (window as any).ethereum.request({
                method: 'eth_requestAccounts',
            });
            return accounts[0];
        } catch (error) {
            console.error("User rejected connection", error);
            return null;
        }
    } else {
        alert("Please install Metamask!");
        return null;
    }
};

export const mintDigitalTwin = async (walletAddress: string, productId: string, productName: string) => {
    const client = await getWalletClient();
    if (!client) return { success: false, error: "No wallet" };

    try {
        // Contract Address (Mock/Placeholder)
        const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with real deployment

        const hash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            abi: DIGITAL_TWIN_ABI,
            functionName: 'mint',
            args: [walletAddress as `0x${string}`, productId, `ipfs://metadata/${productId}`],
            account: walletAddress as `0x${string}`,
        });

        return { success: true, hash };
    } catch (error) {
        console.error("Minting failed", error);
        return { success: false, error };
    }
};
