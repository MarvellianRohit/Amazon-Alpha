"use client"

import React, { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Types ---
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

export type Order = {
    id: string
    customer: string
    total: number
    status: OrderStatus
}

// --- Components ---

function OrderCard({ order, isOverlay }: { order: Order; isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: order.id,
        data: {
            type: 'Order',
            order,
        },
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    if (isOverlay) {
        return (
            <Card className="cursor-grab shadow-xl scale-105 rotate-2">
                <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium flex justify-between">
                        <span>{order.customer}</span>
                        <Badge variant="outline">${order.total}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <span className="text-xs text-muted-foreground">Order ID: {order.id}</span>
                </CardContent>
            </Card>
        )
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 min-h-[80px] rounded-md border-2 border-dashed border-primary/20 bg-primary/5"
            />
        )
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab hover:shadow-md transition-shadow"
        >
            <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium flex justify-between">
                    <span>{order.customer}</span>
                    <Badge variant="outline">${order.total}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <span className="text-xs text-muted-foreground">Order ID: {order.id}</span>
            </CardContent>
        </Card>
    )
}

function BoardColumn({ id, title, orders }: { id: OrderStatus; title: string; orders: Order[] }) {
    const { setNodeRef } = useSortable({
        id: id,
        data: {
            type: 'Column',
            columnId: id,
        },
    })

    return (
        <div ref={setNodeRef} className="flex flex-col gap-4 min-w-[250px] w-full bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg flex items-center justify-between">
                {title}
                <Badge variant="secondary">{orders.length}</Badge>
            </h3>
            <div className="flex flex-col gap-3 min-h-[200px]">
                <SortableContext items={orders.map(o => o.id)} strategy={verticalListSortingStrategy}>
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

// --- Main Board Component ---

interface OrderBoardProps {
    initialOrders: Order[]
}

const COLUMNS: { id: OrderStatus; title: string }[] = [
    { id: 'pending', title: 'Pending' },
    { id: 'processing', title: 'Processing' },
    { id: 'shipped', title: 'Shipped' },
    { id: 'delivered', title: 'Delivered' },
]

export function OrderBoard({ initialOrders }: OrderBoardProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [activeOrder, setActiveOrder] = useState<Order | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function onDragStart(event: DragStartEvent) {
        const { active } = event
        if (active.data.current?.type === 'Order') {
            setActiveOrder(active.data.current.order)
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const isActiveOrdered = active.data.current?.type === 'Order'
        const isOverOrdered = over.data.current?.type === 'Order'
        const isOverColumn = over.data.current?.type === 'Column'

        if (isActiveOrdered && isOverOrdered) {
            setOrders(orders => {
                const activeIndex = orders.findIndex(o => o.id === activeId)
                const overIndex = orders.findIndex(o => o.id === overId)

                // If moving between different status groups, update the status
                if (orders[activeIndex].status !== orders[overIndex].status) {
                    const newOrders = [...orders]
                    newOrders[activeIndex] = {
                        ...newOrders[activeIndex],
                        status: orders[overIndex].status
                    }
                    return arrayMove(newOrders, activeIndex, overIndex)
                }

                return arrayMove(orders, activeIndex, overIndex)
            })
        }

        // Dragging order over a column (empty space in column)
        if (isActiveOrdered && isOverColumn) {
            setOrders(orders => {
                const activeIndex = orders.findIndex(o => o.id === activeId)
                const newStatus = over.id as OrderStatus

                if (orders[activeIndex].status !== newStatus) {
                    const newOrders = [...orders]
                    newOrders[activeIndex] = {
                        ...newOrders[activeIndex],
                        status: newStatus
                    }
                    // Move to end of list for that column effectively (simplified)
                    // In a real arrayMove scenario we'd need to find the correct index, but for now just updating status is visual enough if strict sorting isn't required visually immediately
                    // But sortable requires it to be in the list.
                    // The SortableContext needs the items to be grouped correctly.
                    return arrayMove(newOrders, activeIndex, activeIndex) // Trigger update
                }
                return orders
            })
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveOrder(null)
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <BoardColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        orders={orders.filter(o => o.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeOrder ? <OrderCard order={activeOrder} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    )
}
