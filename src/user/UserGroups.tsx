import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  PageSection,
} from "@patternfly/react-core";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { useAdminClient } from "../context/auth/AdminClient";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { JoinGroupsModal } from "./JoinGroupsModal";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";

export type UserFormProps = {
  username?: string;
  loader?: (
    first?: number,
    max?: number,
    search?: string
  ) => Promise<UserRepresentation[]>;
};

export const UserGroups = ({username}: UserFormProps) => {
  const { t } = useTranslation("roles");
  const { addAlert } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const history = useHistory();


  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [isDirectMembership, setDirectMembership] = useState(false);
  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const loader = async () => {
    const allGroups = await adminClient.users.listGroups({ id });

    console.log(allGroups)
    return allGroups;
  };

  useEffect(() => {
    refresh();
  }, [isDirectMembership]);

  const AliasRenderer = (group: GroupRepresentation) => {
    return <>{group.name}</>;
  };

  const toggleModal = () => setOpen(!open);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleRemoveAssociatedRoleConfirm",
    messageKey: t("roles:roleRemoveAssociatedText"),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.roles.delCompositeRoles({ id }, selectedRows);
        setSelectedRows([]);

        addAlert(t("associatedRolesRemoved"), AlertVariant.success);
      } catch (error) {
        addAlert(t("roleDeleteError", { error }), AlertVariant.danger);
      }
    },
  });

  console.log(username)

  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <JoinGroupsModal
          // onConfirm={addComposites}
          // existingCompositeRoles={additionalRoles}
          open={open}
          toggleDialog={() => setOpen(!open)}
          username={username!}
        />
        <KeycloakDataTable
          key={key}
          loader={loader}
          // isPaginated
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="groups:searchGroup"
          canSelectAll
          onSelect={() => {}}
          toolbarItem={
            <>
              <Checkbox
                label={t("users:directMembership")}
                key="direct-membership-check"
                id="kc-direct-membership-checkbox"
                onChange={() => setDirectMembership(!isDirectMembership)}
                isChecked={isDirectMembership}
              />
              <Button
                className="kc-join-group-button"
                key="join-group-button"
                onClick={() => toggleModal()}
                data-testid="join-group-button"
              >
                {t("users:joinGroup")}
              </Button>
              <Button
                className="kc-leave-group-button"
                key="leave-group-button"
                onClick={() => toggleModal()}
                data-testid="join-group-button"
                variant="link"
              >
                {t("users:leave")}
              </Button>
            </>
          }
          actions={[
            {
              title: t("common:remove"),
              onRowClick: () => {
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "groupMembership",
              displayKey: "users:groupMembership",
              cellRenderer: AliasRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "path",
              displayKey: "users:Path",
              cellFormatters: [emptyFormatter()],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("users:noGroups")}
              instructions={t("users:noGroupsText")}
              primaryActionText={t("users:joinGroup")}
              onPrimaryAction={toggleModal}
            />
          }
        />
      </PageSection>
    </>
  );
};
