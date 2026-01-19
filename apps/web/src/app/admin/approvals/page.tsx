"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Search, FileText, User, Building } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

// Mock Data
const MOCK_REQUESTS = [
    { id: "req_1", name: "Alice Johnson", email: "alice@nyu.edu", university: "NYU", dept: "Computer Science", docUrl: "/placeholder-id.jpg", status: "pending" },
    { id: "req_2", name: "Bob Smith", email: "bob@ucla.edu", university: "UCLA", dept: "Business Admin", docUrl: "/placeholder-id.jpg", status: "pending" },
    { id: "req_3", name: "Charlie Brown", email: "charlie@mit.edu", university: "MIT", dept: "Engineering", docUrl: "/placeholder-id.jpg", status: "pending" },
];

const ANALYTICS_DATA = [
    { name: 'Computer Science', value: 400 },
    { name: 'Business Admin', value: 300 },
    { name: 'Engineering', value: 300 },
    { name: 'Arts', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminApprovalsPage() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_REQUESTS[0]?.id || null);

    const selectedRequest = requests.find(r => r.id === selectedId);

    const handleDecision = (id: string, approved: boolean) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.dismiss();
        toast.success(approved ? "Request Approved" : "Request Rejected");

        // Select next
        const remaining = requests.filter(r => r.id !== id);
        if (remaining.length > 0) setSelectedId(remaining[0].id);
        else setSelectedId(null);
    };

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden bg-gray-50 flex flex-col md:flex-row">

            {/* Sidebar / List (Left Pane) */}
            <div className="w-full md:w-80 border-r bg-white flex flex-col h-full">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg">Approvals Queue</h2>
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input className="w-full pl-9 h-9 text-sm border rounded-md" placeholder="Search students..." />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setSelectedId(req.id)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === req.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="font-medium">{req.name}</div>
                            <div className="text-xs text-gray-500">{req.university}</div>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Building className="w-3 h-3" /> {req.dept}
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                            All caught up!
                        </div>
                    )}
                </div>

                {/* Analytics Mini-Chart */}
                <div className="h-64 border-t p-4 bg-gray-50">
                    <h3 className="text-xs font-semibold mb-2 text-gray-600 uppercase">Trend: Departments</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ANALYTICS_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {ANALYTICS_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Main Content (Split View Right) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedRequest ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full overflow-auto">

                        {/* Document Viewer */}
                        <Card className="h-full flex flex-col overflow-hidden">
                            <CardHeader className="py-3 px-4 bg-gray-100 border-b">
                                <CardTitle className="text-sm font-medium flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Student ID Card
                                </CardTitle>
                            </CardHeader>
                            <div className="flex-1 bg-gray-800 flex items-center justify-center p-4">
                                <div className="text-gray-400 text-sm">
                                    [Mock ID Image Viewer]
                                    <br />
                                    Zoomable / Pan-able
                                </div>
                            </div>
                        </Card>

                        {/* Profile & Actions */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold">{selectedRequest.name}</div>
                                            <div className="text-gray-500">{selectedRequest.email}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-gray-500 text-xs uppercase">University</div>
                                            <div className="font-medium">{selectedRequest.university}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-gray-500 text-xs uppercase">Department</div>
                                            <div className="font-medium">{selectedRequest.dept}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Decision</CardTitle>
                                    <CardDescription>Review the document and verify identity.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleDecision(selectedRequest.id, true)}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleDecision(selectedRequest.id, false)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a request to review details
                    </div>
                )}
            </div>
        </div>
    );
}
