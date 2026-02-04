import { StockManager } from "@/components/admin/StockManager"
import { SalesAnalytics } from "@/components/admin/SalesAnalytics"
import { OrderList } from "@/components/admin/OrderList"

// In a real app, this would be a server component fetching real data
// For now, we mock the initial data or fetch client side in components
// But for "initialOrders", we can show how it's done.

export default function AdminDashboard() {
    const mockOrders = [
        {
            id: 1,
            customer_name: "Ali Baba",
            phone: "012345678",
            quantity: 2,
            total_price: 24.00,
            pickup_datetime: new Date().toISOString(),
            type: 'pickup',
            status: 'pending',
            created_at: new Date().toISOString()
        }
    ]

    return (
        <div className="min-h-screen bg-muted/10">
            <header className="bg-white border-b py-4 px-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    <span className="text-sm text-muted-foreground">Logged in as Admin</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 space-y-6 pb-20">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <SalesAnalytics totalSales={150.00} totalOrders={12} />
                    </div>
                    <div>
                        <StockManager />
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Incoming Orders</h2>
                    <OrderList />
                </div>
            </main>
        </div>
    )
}
