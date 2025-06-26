'use client';
import { useDocs } from '@/presentation/hook/useDocs';

export default function DocsPage() {
  const { docs, loading } = useDocs();

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {docs.map((doc, i) => (
        <li key={i}>
          <strong>{doc.t_name}</strong>: {doc.t_doc}
        </li>
      ))}
    </ul>
  );
}