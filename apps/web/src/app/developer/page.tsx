import { createClient } from "@/lib/supabase/server";
import { ResourcesTable } from "@/components/developer/resources-table";
import { ReadmeViewer } from "@/components/developer/readme-viewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Database } from "lucide-react";

// TODO: Replace with the actual repository
const GITHUB_REPO = "facebook/react"; // Placeholder

async function getReadme() {
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/readme`, {
            headers: {
                Accept: "application/vnd.github.v3.raw",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            console.error("Failed to fetch README:", res.statusText);
            return null;
        }

        return await res.text();
    } catch (error) {
        console.error("Error fetching README:", error);
        return null;
    }
}

async function getResources() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching resources:", error);
        return [];
    }

    return data;
}

export default async function DeveloperDashboard() {
    const [readmeContent, resources] = await Promise.all([
        getReadme(),
        getResources()
    ]);

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage development resources and view project documentation.
                </p>
            </div>

            <Tabs defaultValue="resources" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="resources" className="gap-2">
                        <Database className="h-4 w-4" />
                        Resources
                    </TabsTrigger>
                    <TabsTrigger value="readme" className="gap-2">
                        <Github className="h-4 w-4" />
                        README.md
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>C Programming Snippets</CardTitle>
                            <CardDescription>
                                A collection of useful C code snippets and resources.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResourcesTable resources={resources} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="readme" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Documentation</CardTitle>
                            <CardDescription>
                                Fetched from GitHub: {GITHUB_REPO}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReadmeViewer content={readmeContent || ""} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
