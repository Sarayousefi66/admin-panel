import type { Metadata } from "next";

import { PermissionGuard } from "@/features/auth/components/permission-guard";
import { RoleDetailsPageView } from "@/features/roles/view-role/components/role-details-page-view";

export const metadata: Metadata = {
  title: "Role details",
  description: "View role details and manage permissions",
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoleDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <PermissionGuard permission="roles.view">
      <RoleDetailsPageView roleId={id} />
    </PermissionGuard>
  );
}