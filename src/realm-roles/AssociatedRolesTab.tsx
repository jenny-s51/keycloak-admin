import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  PageSection,
} from "@patternfly/react-core";
import { IFormatter, IFormatterValueType } from "@patternfly/react-table";

import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { formattedLinkTableCell } from "../components/external-link/FormattedLink";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter, toUpperCase } from "../util";
// import { useEffect } from "@storybook/addons";

export const AssociatedRolesTab = () => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const { id } = useParams<{ id: string }>();

  const [selectedRole, setSelectedRole] = useState<RoleRepresentation>();
  const [dummyValue, setDummyValue] = useState(0);

  const [compies, setCompies] = useState([] as RoleRepresentation[])


  const loader = async () => {
    
    const compositeRoles = await adminClient.roles.getCompositeRoles({ id });
    setCompies(compositeRoles);
    return compositeRoles;
  };

  React.useEffect(() => {

    setTimeout(() => {
      console.log(compies);
      loader();
    }, 5000)
    
  }, [dummyValue])

  React.useEffect(() => {

    console.log("fre$h");

  }, [dummyValue])

  const RoleDetailLink = (role: RoleRepresentation) => (
    <>
      <Link key={role.id} to={`${url}/${role.id}`}>
        {role.name}
      </Link>
    </>
  );

  const boolFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    const boolVal = data?.toString();

    return (boolVal ? toUpperCase(boolVal) : undefined) as string;
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleDeleteConfirm",
    messageKey: t("roles:roleDeleteConfirmDialog", {
      selectedRoleName: selectedRole ? selectedRole!.name : "",
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        // await adminClient.roles.delById({
        //   id: selectedRole!.id!,
        // });
        setSelectedRole(undefined);
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });



  const goToCreate = () => history.push(`${url}/add-role`);

  const dumb = () => {
    setDummyValue(Math.random());
    console.log(dummyValue);
  }
  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <KeycloakDataTable
          key={selectedRole ? selectedRole.id : "roleList"}
          loader={loader}
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="roles:searchFor"
          isPaginated
          toolbarItem={
            <>
              <Button onClick={dumb}>{t("createRole")}</Button>
            </>
          }
          actions={[
            {
              title: t("common:delete"),
              onRowClick: (role) => {
                setSelectedRole(role);
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "name",
              displayKey: "roles:roleName",
              cellRenderer: RoleDetailLink,
              cellFormatters: [formattedLinkTableCell(), emptyFormatter()],
            },
            {
              name: "composite",
              displayKey: "roles:composite",
              cellFormatters: [boolFormatter(), emptyFormatter()],
            },
            {
              name: "description",
              displayKey: "common:description",
              cellFormatters: [emptyFormatter()],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("noRolesInThisRealm")}
              instructions={t("noRolesInThisRealmInstructions")}
              primaryActionText={t("createRole")}
              onPrimaryAction={goToCreate}
            />
          }
        />
      </PageSection>
      {dummyValue == 0 ? <div>dummyyy is zero</div> : <div>not zero</div>}
    </>
  );
};
