import "@/styles/globals.css";
import Head from "next/head";
import { AuthProvider } from "@/context/AuthContext"; // 👈 Make sure this path is correct

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AlgoQuest - Become the Legendary Hero of Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="AlgoQuest is a fantasy learning game where you battle complexity using powerful algorithms."
        />
        <link rel="icon" href="/assets/icons/sword.ico" />
      </Head>

      {/* 👇 Wrap the app with AuthProvider */}
      <AuthProvider>
        <main className="font-sans bg-gray-950 text-white min-h-screen">
          <Component {...pageProps} />
        </main>
      </AuthProvider>
    </>
  );
}

export default MyApp;
