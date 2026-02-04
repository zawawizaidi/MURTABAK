"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MockDB } from "@/lib/mockDB"

export function StockManager() {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [stock, setStock] = useState(50)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch stock for selected date
        setStock(MockDB.getStockForDate(date))
    }, [date])

    const updateStock = () => {
        setLoading(true)
        MockDB.setStockForDate(date, stock)
        alert(`Stock for ${date} set to ${stock}!`)
        setLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Daily Stock Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Set Limit (Pieces)</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value))}
                        />
                        <Button onClick={updateStock} disabled={loading}>
                            {loading ? "Saving..." : "Update"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Default stock is 50 if not set.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
