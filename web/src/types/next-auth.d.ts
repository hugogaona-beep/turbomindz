import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:            string
      walletAddress: string
      username?:     string
      avatar?:       string
      role:          string
      referralCode:  string
    }
  }
}
