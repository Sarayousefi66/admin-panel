import type { Metadata } from "next";

import { PermissionGuard } from "@/features/auth/components/permission-guard";
import RolesPageView from "@/features/roles/view-roles/components/roles-page-view";

export const metadata: Metadata = {
  title: "Roles",
  description: "Manage roles and permissions",
};

export default function RolesPage() {
  return (
    <PermissionGuard permission="roles.view">
      <RolesPageView />
    </PermissionGuard>
  );
}