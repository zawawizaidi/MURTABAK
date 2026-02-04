"use client"

// Types
export type Order = {
    id: number
    customer_name: string
    phone: string
    address?: string
    quantity: number
    total_price: number
    pickup_datetime: string
    type: "pickup" | "delivery"
    status: "pending" | "approved" | "rejected"
    created_at: string
}

const STORAGE_KEYS = {
    ORDERS: "murtabak_orders",
    STOCK: "murtabak_stock",
}

// Helpers
export const MockDB = {
    getOrders: (): Order[] => {
        if (typeof window === "undefined") return []
        const stored = localStorage.getItem(STORAGE_KEYS.ORDERS)
        return stored ? JSON.parse(stored) : []
    },

    // Date-based stock system
    // If no key exists for a date, default to 50
    getStockForDate: (dateStr: string): number => {
        if (typeof window === "undefined") return 50
        const stored = localStorage.getItem(STORAGE_KEYS.STOCK)

        let stockMap: Record<string, number> = {}
        try {
            const parsed = stored ? JSON.parse(stored) : {}
            stockMap = typeof parsed === 'number' ? {} : parsed
        } catch { stockMap = {} }

        return stockMap[dateStr] !== undefined ? stockMap[dateStr] : 50
    },

    setStockForDate: (dateStr: string, limit: number) => {
        const stored = localStorage.getItem(STORAGE_KEYS.STOCK)
        const stockMap = stored ? JSON.parse(stored) : {}
        stockMap[dateStr] = limit
        localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockMap))
    },

    // Decrement logic handles specific date
    decrementStock: (dateStr: string, amount: number) => {
        const current = MockDB.getStockForDate(dateStr)
        MockDB.setStockForDate(dateStr, current - amount)
    },

    addOrder: (order: Omit<Order, "id" | "status" | "created_at">) => {
        const orders = MockDB.getOrders()
        const newOrder: Order = {
            ...order,
            id: Date.now(),
            status: "pending",
            created_at: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([newOrder, ...orders]))

        // Decrement stock for the pickup date
        // ensure pickup_datetime is YYYY-MM-DD
        const dateStr = order.pickup_datetime.split('T')[0]
        MockDB.decrementStock(dateStr, order.quantity)

        return newOrder
    },

    updateOrderStatus: (id: number, status: Order["status"]) => {
        const orders = MockDB.getOrders()
        const updated = orders.map(o => (o.id === id ? { ...o, status } : o))
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated))
    },
}
