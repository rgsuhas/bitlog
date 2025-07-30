// Server Component — handles dynamic routing
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import EditorPage from '..components/editor';

// Dynamically import the actual client editor (so you can use 'use client' there)
const EditorPage = dynamic(() => import('.componnets/editor/EditorPage'), { ssr: false });

type Props = {
  params: { slug: string };
};

export default function EditorPage({ params }: Props) {
  const { slug } = params;

  // Optionally validate slug here
  if (!slug) return notFound();

  return <EditorPage params={{ slug: "new" }}>;
}
