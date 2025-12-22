import GroupDetails from "@/components/dashboard/features/groups/group-details"

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <GroupDetails groupId={id} />
}