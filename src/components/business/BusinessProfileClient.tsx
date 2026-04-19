'use client';
export default function BusinessProfileClient({ id }: { id: string }) {
  return <div className="p-8"><h1 className="text-2xl font-bold">Business: {id}</h1></div>;
}
