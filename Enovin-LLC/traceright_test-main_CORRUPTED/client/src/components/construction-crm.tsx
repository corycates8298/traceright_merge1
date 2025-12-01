import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, DollarSign, FileSignature, Truck } from 'lucide-react';

// --- Types ---
interface Deal {
    id: string;
    clientName: string;
    value: number;
    stage: 'lead' | 'negotiation' | 'signed' | 'construction';
}

interface Quote {
    tier: 'Good' | 'Better' | 'Best';
    price: number;
    features: string[];
}

// --- Mock Data ---
const initialDeals: Deal[] = [
    { id: 'd1', clientName: 'Acme Corp HQ', value: 150000, stage: 'negotiation' },
    { id: 'd2', clientName: 'Smith Residence', value: 45000, stage: 'lead' },
    { id: 'd3', clientName: 'Downtown Lofts', value: 320000, stage: 'construction' },
];

export default function ConstructionCRM() {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [sqFt, setSqFt] = useState(1000);
    const [quotes, setQuotes] = useState<Quote[] | null>(null);

    // --- Kanban Logic ---
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(deals);
        const [reorderedItem] = items.splice(result.source.index, 1);
        reorderedItem.stage = result.destination.droppableId as Deal['stage'];
        items.splice(result.destination.index, 0, reorderedItem);

        setDeals(items);
    };

    // --- Estimator Logic ---
    const generateQuotes = () => {
        // Simulation of the backend logic
        const base = sqFt * 150;
        setQuotes([
            { tier: 'Good', price: base * 0.9, features: ['Standard Materials', '8 Weeks'] },
            { tier: 'Better', price: base, features: ['Premium Materials', '6 Weeks', '5yr Warranty'] },
            { tier: 'Best', price: base * 1.3, features: ['Luxury Materials', '4 Weeks', 'Lifetime Warranty', '24/7 Support'] },
        ]);
    };

    return (
        <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Construction CRM & Estimator</h1>
                <Badge variant="outline" className="px-4 py-1 text-lg">Voltron V2 Active</Badge>
            </div>

            <Tabs defaultValue="pipeline" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="pipeline">Pipeline (Kanban)</TabsTrigger>
                    <TabsTrigger value="estimator">Smart Estimator</TabsTrigger>
                </TabsList>

                {/* --- Kanban Pipeline --- */}
                <TabsContent value="pipeline" className="mt-6">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-4 gap-4">
                            {['lead', 'negotiation', 'signed', 'construction'].map((stage) => (
                                <Droppable key={stage} droppableId={stage}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="bg-slate-100 p-4 rounded-xl min-h-[500px]"
                                        >
                                            <h3 className="font-semibold text-slate-500 mb-4 uppercase text-sm tracking-wider">{stage}</h3>
                                            {deals.filter(d => d.stage === stage).map((deal, index) => (
                                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="font-medium text-slate-900">{deal.clientName}</div>
                                                            <div className="text-slate-500 text-sm mt-1">${deal.value.toLocaleString()}</div>
                                                            <div className="flex gap-2 mt-3">
                                                                {stage === 'signed' && <FileSignature className="w-4 h-4 text-green-500" />}
                                                                {stage === 'construction' && <Truck className="w-4 h-4 text-blue-500" />}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </TabsContent>

                {/* --- Good/Better/Best Estimator --- */}
                <TabsContent value="estimator" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Input Panel */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Square Footage</Label>
                                    <Input
                                        type="number"
                                        value={sqFt}
                                        onChange={(e) => setSqFt(Number(e.target.value))}
                                    />
                                </div>
                                <Button onClick={generateQuotes} className="w-full bg-blue-600 hover:bg-blue-700">
                                    Generate AI Quotes
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Results Panel */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quotes ? quotes.map((quote) => (
                                <Card key={quote.tier} className={`border-2 ${quote.tier === 'Best' ? 'border-yellow-400 bg-yellow-50/50' : 'border-slate-200'}`}>
                                    <CardHeader>
                                        <CardTitle className="text-center text-2xl">{quote.tier}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center space-y-4">
                                        <div className="text-3xl font-bold text-slate-900">
                                            ${quote.price.toLocaleString()}
                                        </div>
                                        <ul className="text-sm text-slate-600 space-y-2 text-left px-4">
                                            {quote.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-600" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="w-full mt-4" variant={quote.tier === 'Best' ? 'default' : 'outline'}>
                                            Select {quote.tier}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-3 flex items-center justify-center h-64 text-slate-400 border-2 border-dashed rounded-xl">
                                    Enter project details to generate quotes
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
