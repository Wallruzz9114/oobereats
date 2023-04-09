import Head from 'next/head';

import Layout, { siteTitle } from '../components/layout';

const RootScreen = (): JSX.Element => (
  <Layout home>
    <Head>
      <title>{siteTitle}</title>
    </Head>
  </Layout>
);

export default RootScreen;
