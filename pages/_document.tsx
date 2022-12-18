import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import React from "react";
import {
  revalidate,
  FlushedChunks,
  flushChunks,
} from "@module-federation/nextjs-mf/utils";

type Props = {
  chunks: string[];
};

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    console.log("process.env.NODE_ENV :>> ", process.env.NODE_ENV);
    console.log(
      'ctx.req.url.includes("_next") :>> ',
      ctx.req?.url?.includes("_next")
    );
    if (
      process.env.NODE_ENV === "development" &&
      !ctx.req?.url?.includes("_next")
    ) {
      await revalidate().then(shouldReload => {
        console.log("shouldReload", shouldReload);
        if (shouldReload) {
          ctx.res?.writeHead(302, { Location: ctx?.req?.url });
          ctx.res?.end();
        }
      });
    } else {
      ctx.res?.on("finish", () => {
        revalidate();
      });
    }

    const chunks = await flushChunks();
    const initialProps = await Document.getInitialProps(ctx);
    console.log("chunks :>> ", chunks);

    return {
      ...initialProps,
      chunks,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          {/* @ts-ignore */}
          <FlushedChunks chunks={this.props.chunks} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
