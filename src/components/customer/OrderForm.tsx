"use client"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MockDB } from "@/lib/mockDB"
import { Badge } from "@/components/ui/badge"

interface OrderFormProps {
    quantity: number
    totalPrice: number
    onSuccess: () => void
}

// Helper to format date consistent with HTML date input
const toDateInput = (date: Date) => format(date, "yyyy-MM-dd")

export function OrderForm({ quantity, totalPrice, onSuccess }: OrderFormProps) {
    const [loading, setLoading] = useState(false)
    const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup")
    const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()))

    // Dynamic stock for date
    const [stockForDate, setStockForDate] = useState(50)

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        pickupTime: "",
    })

    // Poll stock for selected date
    useEffect(() => {
        const checkStock = () => {
            const s = MockDB.getStockForDate(selectedDate)
            setStockForDate(s)
        }
        checkStock()
        const interval = setInterval(checkStock, 1000)
        return () => clearInterval(interval)
    }, [selectedDate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Final check
        if (stockForDate < quantity) {
            alert("Sorry, not enough stock for this date!")
            setLoading(false)
            return
        }

        try {
            MockDB.addOrder({
                customer_name: formData.name,
                phone: formData.phone,
                address: formData.address, // Added Address
                quantity: quantity,
                total_price: totalPrice,
                type: orderType,
                pickup_datetime: `${selectedDate}T${formData.pickupTime || "12:00"}`,
            })

            onSuccess()
        } catch (err) {
            console.error(err)
            alert("Failed to place order.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const maxDate = toDateInput(addDays(new Date(), 15))
    const minDate = toDateInput(new Date())

    const isSoldOut = stockForDate < quantity

    return (
        <Card className="border-none shadow-lg">
            <CardHeader>
                <CardTitle>Place Your Order</CardTitle>
                <CardDescription>Select a date up to 15 days in advance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} id="order-form" className="space-y-4">

                    <div className="space-y-2">
                        <Label>Select Date</Label>
                        <Input
                            type="date"
                            min={minDate}
                            max={maxDate}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <div className="flex justify-between text-xs">
                            <span>Availability:</span>
                            <Badge variant={stockForDate > 0 ? "outline" : "destructive"}>
                                {stockForDate} pieces left
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="011-xxxx xxxx"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fulfillment Method</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={orderType === "pickup" ? "default" : "outline"}
                                className={cn(orderType === "pickup" ? "bg-secondary text-secondary-foreground" : "")}
                                onClick={() => setOrderType("pickup")}
                            >
                                Self Pickup
                            </Button>
                            <Button
                                type="button"
                                variant={orderType === "delivery" ? "default" : "outline"}
                                className={cn(orderType === "delivery" ? "bg-secondary text-secondary-foreground" : "")}
                                onClick={() => setOrderType("delivery")}
                            >
                                Delivery
                            </Button>
                        </div>
                    </div>

                    {orderType === "pickup" ? (
                        <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                            <p className="font-semibold text-primary">Pickup Location:</p>
                            <p>8551B, Jalan Setia, Sungai Ramal Baru, 43000 Kajang</p>

                            <div className="mt-4">
                                <Label htmlFor="pickupTime">Pickup Time</Label>
                                <Input
                                    type="time"
                                    id="pickupTime"
                                    name="pickupTime"
                                    required
                                    value={formData.pickupTime}
                                    onChange={handleChange}
                                    className="mt-1 bg-white"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-muted p-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="No 123, Jalan Baru, Taman ..."
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <p className="text-xs text-muted-foreground">Delivery is handled by Lalamove. Rates apply.</p>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={() => window.open('https://www.lalamove.com', '_blank')}
                            >
                                Check Rates
                            </Button>

                            <Label htmlFor="pickupTime">Preferred Time</Label>
                            <Input
                                type="time"
                                id="pickupTime"
                                name="pickupTime"
                                required
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="mt-1 bg-white"
                            />
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-4 border-t bg-muted/20 p-6">
                <div className="flex w-full justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>RM {totalPrice.toFixed(2)}</span>
                </div>
                <Button
                    type="submit"
                    form="order-form"
                    className="w-full bg-secondary text-secondary-foreground text-lg py-6"
                    disabled={loading || isSoldOut}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSoldOut ? "Sold Out for Date" : "Place Order"}
                </Button>
            </CardFooter>
        </Card>
    )
}
