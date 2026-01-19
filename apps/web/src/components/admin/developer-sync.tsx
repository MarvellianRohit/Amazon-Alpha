"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, RefreshCw, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeveloperSync() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string | null>(null);
    const [repoUrl, setRepoUrl] = useState<string | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/v1/github/sync", {
                method: "POST",
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Sync Failed");

            setLastSynced(new Date().toLocaleTimeString());
            if (data.github_url) setRepoUrl(data.github_url);

            toast.success("Classwork synced to GitHub successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to sync with GitHub.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Github className="w-5 h-5 text-gray-900" />
                        Developer Sync
                    </CardTitle>
                    <CardDescription>
                        Push latest resources to <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">BCA-Section-B-Work</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {lastSynced ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Synced: {lastSynced}</span>
                            </div>
                        ) : (
                            <span>Status: Ready to Sync</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {repoUrl && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={repoUrl} target="_blank" rel="noreferrer">
                                    View Code <ExternalLink className="w-3 h-3 ml-2" />
                                </a>
                            </Button>
                        )}
                        <Button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            {isSyncing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            {isSyncing ? "Pushing..." : "Sync Now"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
