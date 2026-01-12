import { ManageProductClient } from "@/components/master-components/insurance/manage-product-client"

export default async function ManageProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params

  return <ManageProductClient productId={productId} />
}
