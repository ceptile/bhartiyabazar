import BusinessProfileClient from '@/components/business/BusinessProfileClient';

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BusinessProfileClient id={id} />;
}