'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Copy, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
    id: string;
    title: string;
    description: string | null;
    content: string;
    language: string;
    created_at: string;
}

interface ResourcesTableProps {
    resources: Resource[] | null;
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
    if (!resources || resources.length === 0) {
        return (
            <div className="p-8 text-center border rounded-md bg-muted/20">
                <FileCode className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No Resources Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Add C snippets to the database to see them here.
                </p>
            </div>
        );
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Language</TableHead>
                        <TableHead className="w-[100px] text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.title}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {resource.description || '-'}
                            </TableCell>
                            <TableCell>
                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    {resource.language}
                                </code>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(resource.content)}
                                    title="Copy Snippet"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
