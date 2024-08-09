// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/next/providers/google'
import axios from 'axios'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth?response_type=code'
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      // Call your backend to get the token
      const response = await axios.post('http://localhost:8080/success', {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        }
      });
      
      // Save the token in user's session
      user.token = response.data.token;
      return true;
    },
    async session(session, token) {
      session.user.token = token.token;
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (account) {
        token.token = user.token;
      }
      return token;
    }
  }
})
