"use client"

import { motion } from "framer-motion"
import React from "react"

interface StaggerListProps {
    children: React.ReactNode
    className?: string
    staggerDelay?: number
}

export function StaggerList({ children, className, staggerDelay = 0.05 }: StaggerListProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {React.Children.map(children, (child) => (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}
