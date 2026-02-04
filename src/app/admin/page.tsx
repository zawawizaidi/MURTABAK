"use client"

import { useState, useEffect } from "react"
import { OrderList } from "@/components/admin/OrderList"
import { StockManager } from "@/components/admin/StockManager"
import { SalesAnalytics } from "@/components/admin/SalesAnalytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// In a real app, this would be a server component fetching real data
// For now, we mock the initial data or fetch client side in components
// But for "initialOrders", we can show how it's done.

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")

    useEffect(() => {
        const auth = sessionStorage.getItem("admin_auth")
        if (auth === "true") setIsAuthenticated(true)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === "MOZA2003") {
            setIsAuthenticated(true)
            sessionStorage.setItem("admin_auth", "true")
        } else {
            alert("Invalid Password")
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Admin Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                            />
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-primary text-primary-foreground p-6 shadow-md mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Button variant="secondary" onClick={() => {
                        setIsAuthenticated(false)
                        sessionStorage.removeItem("admin_auth")
                    }}>Logout</Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 space-y-6 pb-20">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <SalesAnalytics />
                    </div>
                    <div>
                        <StockManager />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Order Management</h2>
                    <OrderList />
                </div>
            </main>
        </div>
    )
}
