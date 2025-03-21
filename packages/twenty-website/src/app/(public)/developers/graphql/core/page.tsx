'use client';
import dynamic from 'next/dynamic';

const GraphQlPlayground = dynamic(
  () => import('@/app/_components/playground/graphql-playground'),
  { ssr: false },
);

const CoreGraphql = () => {
  return <GraphQlPlayground subDoc={'core'} />;
};

export default CoreGraphql;
