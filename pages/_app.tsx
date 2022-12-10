import Head from "next/head";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "share/elements/staticComponents";
import { wrapper } from "share/store";

if (process.env.ENVIRONMENT === "client") {
  require("./../styles/globals.css");
}

export default function MyApp({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <>
      <Head>
        <title>My new cool app</title>
      </Head>
      <ErrorBoundary>
        <StrictMode>
          <Provider store={store}>
            <Component {...props.pageProps} />
          </Provider>
        </StrictMode>
      </ErrorBoundary>
    </>
  );
}
