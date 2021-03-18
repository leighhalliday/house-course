import { AppProps } from "next/app";
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
            <Component {...pageProps} />
          </SportFilterProvider>
        </ApolloProvider>
      </AuthProvider>
    </>
  );
}
