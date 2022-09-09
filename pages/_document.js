import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        </Head>
        <body>
          <script defer src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument