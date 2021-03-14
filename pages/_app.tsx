import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo";
import { AuthProvider } from "src/auth/useAuth";
import { SportFilterProvider } from "src/context/sportFilter";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo();

  return (
    <>
      <AuthProvider>
        <ApolloProvider client={client}>
          <SportFilterProvider>
            <Head>
              <title>SportySpots</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </SportFilterProvider>
        </ApolloProvider>
      </AuthProvider>
    </>
  );
}
