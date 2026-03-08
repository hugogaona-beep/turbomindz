import { redirect } from 'next/navigation'

// Redirect to dashboard vault (canonical location)
export default function MyVaultRedirect() {
  redirect('/dashboard/vault')
}
