import React from "react";
import { PageSection } from "@patternfly/react-core";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient } from "../context/auth/AdminClient";
import { RolesList } from "./RolesList";

export const RealmRolesSection = () => {
  const adminClient = useAdminClient();
  const loader = async (to?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      to: to!,
      max: max!,
      search: search!,
    };
    return await adminClient.roles.find(params);
  };
  return (
    <>
      <ViewHeader
        actionsDropdownId="realm-roles-section-dropdown"
        titleKey="roles:title"
        subKey="roles:roleExplain"
      />
      <PageSection variant="light">
        <RolesList loader={loader} />
      </PageSection>
    </>
  );
};
