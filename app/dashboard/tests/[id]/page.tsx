import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { TestDetailHeader } from "@/components/dashboard/tests/test-detail-header"
import { TestDetailContent } from "@/components/dashboard/tests/test-detail-content"

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <TestDetailHeader testId={id} />
        <main className="p-6 lg:p-8">
          <TestDetailContent testId={id} />
        </main>
      </div>
    </div>
  )
}
