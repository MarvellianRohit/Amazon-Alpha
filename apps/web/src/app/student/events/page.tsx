
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="container mx-auto max-w-5xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Campus Events</h1>
                    <p className="text-muted-foreground">Discover what's happening around you.</p>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="flex flex-col md:flex-row overflow-hidden hover:border-indigo-500 transition-colors cursor-pointer group">
                            <div className="w-full md:w-48 bg-indigo-100 flex flex-col items-center justify-center p-4 text-indigo-900 border-b md:border-b-0 md:border-r border-indigo-200">
                                <span className="text-sm font-bold uppercase">OCT</span>
                                <span className="text-4xl font-black">2{i}</span>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">Tech Career Fair 2026</h3>
                                        <Badge variant="outline">Career</Badge>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2">
                                        Meet recruiters from top tech companies including Google, Amazon, and Microsoft. Bring your resume!
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Student Union Hall</div>
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> 10:00 AM - 4:00 PM</div>
                                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 342 attending</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
