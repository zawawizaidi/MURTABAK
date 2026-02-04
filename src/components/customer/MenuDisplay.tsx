"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuDisplayProps {
    quantity: number
    setQuantity: (acc: number) => void
    dailyStock: number
}

export function MenuDisplay({ quantity, setQuantity, dailyStock }: MenuDisplayProps) {
    const isSoldOut = dailyStock <= 0

    const increment = () => {
        if (quantity < dailyStock) {
            setQuantity(quantity + 1)
        }
    }

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    return (
        <div className="w-full space-y-4">
            <Card className="overflow-hidden border-none shadow-lg">
                <div className="relative h-64 w-full bg-slate-100">
                    {/* Placeholder for actual image */}
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-lg font-medium">Murtabak Image Here</span>
                    </div>
                    {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <Badge variant="destructive" className="text-lg px-4 py-2">SOLD OUT</Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Murtabak Ayam Mix Daging</h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Authentic recipe with generous filling. Served with pickled onions and curry.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold">RM 12.00</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm font-medium text-muted-foreground">
                            Daily Stock: <span className={dailyStock < 10 ? "text-red-500" : "text-black"}>{dailyStock}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={decrement}
                                disabled={quantity <= 1 || isSoldOut}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={increment}
                                disabled={quantity >= dailyStock || isSoldOut}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
