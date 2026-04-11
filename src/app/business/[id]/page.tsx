import BusinessProfileClient from '@/components/business/BusinessProfileClient';

export default function BusinessPage({ params }: { params: { id: string } }) {
  return <BusinessProfileClient id={params.id} />;
}
