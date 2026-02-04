"use client"

import { useState, useEffect } from "react"
import { MenuDisplay } from "@/components/customer/MenuDisplay"
import { OrderForm } from "@/components/customer/OrderForm"
import { MockDB } from "@/lib/mockDB"

export default function Home() {
    const [quantity, setQuantity] = useState(1)
    const [dailyStock, setDailyStock] = useState(50) // Default stock
    const [orderPlaced, setOrderPlaced] = useState(false)
    const unitPrice = 12.00

    // Poll for stock updates to show "Sold Out" in real time
    useEffect(() => {
        // Initial fetch
        const today = new Date().toISOString().split('T')[0]
        setDailyStock(MockDB.getStockForDate(today))

        const interval = setInterval(() => {
            const t = new Date().toISOString().split('T')[0]
            setDailyStock(MockDB.getStockForDate(t))
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl">
                        ✓
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Order Received!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your order. We will contact you shortly via WhatsApp to confirm payment.
                    </p>
                    <button
                        onClick={() => setOrderPlaced(false)}
                        className="text-primary hover:underline font-medium"
                    >
                        Place Another Order
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Header */}
            <header className="bg-primary text-primary-foreground py-6 shadow-md">
                <div className="container-centered text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight">Murtabak Edy Legend</h1>
                    <p className="text-primary-foreground/80 mt-1">Authentic & Delicious</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-centered mt-6 space-y-6">
                <MenuDisplay
                    quantity={quantity}
                    setQuantity={setQuantity}
                    dailyStock={dailyStock}
                />

                <OrderForm
                    quantity={quantity}
                    totalPrice={quantity * unitPrice}
                    onSuccess={() => setOrderPlaced(true)}
                // dailyStock handled internally
                />
            </main>

            {/* Mobile Sticky Bar (Visible only on small screens if needed, but styling allows flowing normally) */}
            <div className="md:hidden h-4 w-full"></div>
        </div>
    )
}
