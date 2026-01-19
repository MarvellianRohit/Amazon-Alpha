import ReactMarkdown from 'react-markdown';

interface ReadmeViewerProps {
    content: string;
}

export function ReadmeViewer({ content }: ReadmeViewerProps) {
    if (!content) {
        return (
            <div className="p-4 border rounded-md bg-muted/50 text-center text-muted-foreground">
                No README content available.
            </div>
        );
    }

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none p-6 border rounded-md shadow-sm bg-card">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
