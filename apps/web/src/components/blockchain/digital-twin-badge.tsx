import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Box, CheckCircle, Clock } from "lucide-react";

interface DigitalTwinBadgeProps {
    status: 'minted' | 'pending' | 'failed' | 'none';
    tokenId?: string;
    txHash?: string;
}

export function DigitalTwinBadge({ status, tokenId, txHash }: DigitalTwinBadgeProps) {
    if (status === 'none') return null;

    return (
        <HoverCard>
            <HoverCardTrigger>
                <Badge variant={status === 'minted' ? 'default' : 'secondary'} className={`cursor-pointer flex items-center gap-1 ${status === 'minted' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                    {status === 'minted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {status === 'minted' ? 'Digital Twin' : 'Minting...'}
                </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Box className="w-4 h-4 text-purple-600" /> Authenticated on Polygon
                        </h4>
                        <p className="text-sm text-gray-500">
                            This item includes a verified NFT Certificate of Authenticity.
                        </p>
                        {tokenId && (
                            <div className="pt-2">
                                <span className="text-xs font-mono bg-slate-100 p-1 rounded">Token ID: {tokenId}</span>
                            </div>
                        )}
                        {txHash && (
                            <div className="pt-1">
                                <a
                                    href={`https://polygonscan.com/tx/${txHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    View on Blockchain
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
