"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MockDB, type Order } from "@/lib/mockDB"
import { MessageCircle, Printer } from "lucide-react"

export function OrderList() {
    const [orders, setOrders] = useState<Order[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const loadOrders = () => {
            setOrders(MockDB.getOrders())
        }
        loadOrders()
        const interval = setInterval(loadOrders, 2000)
        return () => clearInterval(interval)
    }, [])

    const updateStatus = (id: number, status: Order["status"]) => {
        MockDB.updateOrderStatus(id, status)

        // Auto-open WhatsApp on action if desired, but better to keep it manual button
        setOrders(MockDB.getOrders())
    }

    const generateWhatsAppLink = (order: Order, type: 'confirm' | 'reject') => {
        const date = order.pickup_datetime.split('T')[0]
        const time = order.pickup_datetime.split('T')[1] || "Time N/A"

        let text = ""
        if (type === 'confirm') {
            text = `Hello ${order.customer_name}, ✅ Your order for Murtabak Edy Legend is CONFIRMED!\n\n` +
                `📅 Date: ${date}\n` +
                `🕒 Time: ${time}\n` +
                `📦 Qty: ${order.quantity}\n` +
                `💰 Total: RM ${order.total_price.toFixed(2)}\n\n` +
                (order.type === 'delivery' ? `🚚 Delivering to: ${order.address}\n` : `📍 Self Pickup at our stall.\n`) +
                `Type: ${order.type.toUpperCase()}\n\n` +
                `Thank you!`
        } else {
            text = `Hello ${order.customer_name}, ❌ Sorry, your order for ${date} cannot be fulfilled at this time.\n\nReason: Stock unavailable / Closed.\n\nPlease contact us for more info.`
        }

        return `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
    }

    const printOrder = (order: Order) => {
        const content = `
        <html>
          <head>
            <title>Order #${order.id}</title>
            <style>
               body { font-family: sans-serif; padding: 20px; }
               .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; }
               .item { margin: 10px 0; font-size: 1.2em; }
               .total { font-size: 1.5em; font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
             <div class="header">
                <h1>Murtabak Edy Legend</h1>
                <p>Order Date: ${new Date().toLocaleString()}</p>
             </div>
             <div class="item"><strong>Customer:</strong> ${order.customer_name}</div>
             <div class="item"><strong>Phone:</strong> ${order.phone}</div>
             ${order.address ? `<div class="item"><strong>Address:</strong> ${order.address}</div>` : ''}
             <hr/>
             <div class="item"><strong>Item:</strong> Murtabak Ayam Mix Daging</div>
             <div class="item"><strong>Quantity:</strong> ${order.quantity}</div>
             <div class="item"><strong>Pickup/Delivery:</strong> ${(() => {
                try {
                    return format(new Date(order.pickup_datetime), "yyyy-MM-dd hh:mm a")
                } catch (e) {
                    return "Time N/A"
                }
            })()}</div>
             <div class="total">Total: RM ${order.total_price.toFixed(2)}</div>
             <script>window.print();</script>
          </body>
        </html>
      `
        const w = window.open('', '', 'width=600,height=600')
        w?.document.write(content)
        w?.document.close()
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge variant="success">Approved</Badge>
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>
            default: return <Badge variant="warning">Pending</Badge>
        }
    }

    if (!mounted) return <div>Loading...</div>

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => {
                            // Handle potential concatenated date string from OrderForm or invalid dates
                            // Our internal format is YYYY-MM-DDTHH:MM
                            let pickupDate = new Date()
                            try {
                                pickupDate = new Date(order.pickup_datetime)
                                if (isNaN(pickupDate.getTime())) throw new Error("Invalid date")
                            } catch (e) {
                                pickupDate = new Date() // Fallback
                            }

                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        <div>{format(pickupDate, "dd MMM")}</div>
                                        <div className="text-xs text-muted-foreground">{format(pickupDate, "hh:mm a")}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">{order.customer_name}</div>
                                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                                        {order.address && <div className="text-[10px] text-gray-500 max-w-[150px] truncate">{order.address}</div>}
                                    </TableCell>
                                    <TableCell>
                                        <div>{order.quantity}x Murtabak</div>
                                        <div className="text-xs font-semibold">RM {order.total_price.toFixed(2)}</div>
                                        <Badge variant="outline" className="mt-1 text-[10px] uppercase">{order.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col gap-2 items-end">

                                            {/* Status Actions */}
                                            {order.status === 'pending' && (
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="default" className="bg-green-600 h-8 w-8" onClick={() => updateStatus(order.id, 'approved')} title="Approve">
                                                        ✓
                                                    </Button>
                                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => updateStatus(order.id, 'rejected')} title="Reject">
                                                        ✕
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Communication Actions */}
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-200" onClick={() => window.open(generateWhatsAppLink(order, 'confirm'), '_blank')} title="WhatsApp Confirm">
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200" onClick={() => window.open(generateWhatsAppLink(order, 'reject'), '_blank')} title="WhatsApp Reject">
                                                    <span className="text-[10px] font-bold">X</span>
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500" onClick={() => printOrder(order)} title="Print">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            </div>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
