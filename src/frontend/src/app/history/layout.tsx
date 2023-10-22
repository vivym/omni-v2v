import { MainLayout } from "@/components/MainLayout"

export default function ViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
