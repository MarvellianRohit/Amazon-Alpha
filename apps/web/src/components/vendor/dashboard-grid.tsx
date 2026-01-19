"use client";

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableWidget } from './draggable-widget';
import { ComparisonChart } from './comparison-chart';
import { StatCard } from './stat-card';
import { SalesChart } from './sales-chart';
import { InventoryTable } from './inventory-table';
import { VendorAIChat } from './vendor-ai-chat';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const INITIAL_ITEMS = [
    'stats_gmv', 'stats_units', 'stats_rating', 'stats_growth',
    'stats_gmv', 'stats_units', 'stats_rating', 'stats_growth',
    'chart_main', 'chart_comparison', 'widget_ai_consultant',
    'table_inventory'
];

export function DashboardGrid() {
    const [items, setItems] = useState(INITIAL_ITEMS);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id.toString());
                const newIndex = items.indexOf(over.id.toString());
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    // Component Map
    const renderItem = (id: string) => {
        switch (id) {
            case 'stats_gmv':
                return <StatCard title="Total Revenue" value="$45,231.89" description="+20.1% from last month" icon={DollarSign} trend={{ value: 20, isPositive: true }} />;
            case 'stats_units':
                return <StatCard title="Units Sold" value="2,345" description="+180 last 7 days" icon={ShoppingCart} trend={{ value: 12, isPositive: true }} />;
            case 'stats_rating':
                return <StatCard title="Vendor Rating" value="4.8/5.0" description="Top 5% of sellers" icon={TrendingUp} />;
            case 'stats_growth':
                return <StatCard title="Inventory Value" value="$12,450" description="15 items low stock" icon={Package} />;
            case 'chart_main':
                return <SalesChart />; // Existing component
            case 'chart_comparison':
                return <ComparisonChart />; // New component
            case 'table_inventory':
                return <div className="p-4"><h3 className="text-lg font-semibold mb-2">Inventory Status</h3><InventoryTable /></div>; // Existing component wrapper
            case 'widget_ai_consultant':
                return <VendorAIChat />;
            default:
                return <div>Unknown Widget</div>;
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((id) => {
                        // Determine responsive span
                        let spanClass = "col-span-1";
                        if (id === 'chart_main' || id === 'chart_comparison') spanClass = "col-span-1 md:col-span-2";
                        if (id === 'table_inventory') spanClass = "col-span-1 md:col-span-2 lg:col-span-4";
                        if (id === 'widget_ai_consultant') spanClass = "col-span-1 md:col-span-1 lg:col-span-1 row-span-2"; // Make it tall

                        return (
                            <div key={id} className={spanClass}>
                                <DraggableWidget id={id}>
                                    {renderItem(id)}
                                </DraggableWidget>
                            </div>
                        )
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
