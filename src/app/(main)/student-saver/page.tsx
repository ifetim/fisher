// src/app/(main)/student-saver/page.tsx
// Sits inside the AppShell (sidebar + bottom nav) automatically via layout.tsx.

import { StudentSaverPage } from '@/views/StudentSaverPage'

export const metadata = {
  title: 'Student Saver - ClearMint',
}

export default function Page() {
  return <StudentSaverPage />
}