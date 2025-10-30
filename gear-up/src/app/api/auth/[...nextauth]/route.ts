import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables"
  );
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: "jwt", // ✅ prevents NextAuth from using cookies as sessions
  },
  callbacks: {
    async jwt({ token, account }) {
      // ✅ Attach Google access token to JWT
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // ✅ Expose access token to client
      (session as any).access_token = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export const GET = handler;
export const POST = handler;
