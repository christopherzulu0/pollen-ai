import GroupDetails from "@/components/dashboard/features/groups/group-details"

export default function GroupPage({ params }: { params: { id: string } }) {
  return <GroupDetails groupId={params.id} />
} 