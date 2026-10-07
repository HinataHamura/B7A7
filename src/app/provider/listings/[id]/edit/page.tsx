import ListingEditor from '@/components/listing-editor';

export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  return <ListingEditor listingId={params.id} />;
}
