'use client';

import { withRole } from '@/components/auth/AuthProvider';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Dynamically import the actual client editor (so you can use 'use client' there)
const DynamicEditorPage = dynamic(() => import('@/components/editor/EditorPage'), { ssr: false });

type Props = {
  params: { slug: string };
};

function EditorPage(props: Props) {
  const { slug } = props.params;

  // Optionally validate slug here
  if (!slug) return notFound();

  return <DynamicEditorPage params={{ slug }} />;
}

export default withRole(EditorPage, ['author', 'admin']);
