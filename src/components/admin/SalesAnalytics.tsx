"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag } from "lucide-react"
import { MockDB } from "@/lib/mockDB"

export function SalesAnalytics() {
    const [stats, setStats] = useState({ sales: 0, count: 0 })

    useEffect(() => {
        const fetchStats = () => {
            const orders = MockDB.getOrders()
            // Calculate total sales for ALL orders or just Approved? Usually all or approved.
            // Let's count "Approved" orders for revenue, but "Total Orders" as count of all.
            const approvedOrders = orders.filter(o => o.status === 'approved')
            const totalSales = approvedOrders.reduce((acc, curr) => acc + curr.total_price, 0)

            setStats({
                sales: totalSales,
                count: orders.length
            })
        }

        fetchStats()
        const interval = setInterval(fetchStats, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue (Approved)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">RM {stats.sales.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.count}</div>
                </CardContent>
            </Card>
        </div>
    )
}
