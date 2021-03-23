import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { CaretDownIcon, FilterIcon } from "@patternfly/react-icons";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
// import { AliasRendererComponent } from "./AliasRendererComponent";

export type JoinGroupsModalProps = {
  open: boolean;
  toggleDialog: () => void;
  username: string;
  onConfirm: (newReps: GroupRepresentation[]) => void;
};

const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return [
      {
        key: "",
        value: "",
      },
    ];
  }
  return Object.keys(attributes).map((key) => ({
    key: key,
    value: attributes[key],
  }));
};


export const JoinGroupsModal = (props: JoinGroupsModalProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("roles");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const { id } = useParams<{ id: string }>();

  const alphabetize = (rolesList: RoleRepresentation[]) => {
    return rolesList.sort((r1, r2) => {
      const r1Name = r1.name?.toUpperCase();
      const r2Name = r2.name?.toUpperCase();
      if (r1Name! < r2Name!) {
        return -1;
      }
      if (r1Name! > r2Name!) {
        return 1;
      }

      return 0;
    });
  };

  const loader = async () => {
    const allGroups = await adminClient.groups.find();
    const existingUserGroups = await adminClient.users.listGroups({id});

    return alphabetize(allGroups).filter((group: GroupRepresentation) => {
      return (
        existingUserGroups.find(
          (existing: GroupRepresentation) => existing.name === group.name
        ) === undefined && group.name !== name
      );
    });

  };

  console.log(selectedRows)


  // const AliasRenderer = (role: RoleRepresentation) => {
  //   return (
  //     <>
  //       <AliasRendererComponent
  //         id={id}
  //         name={role.name}
  //         adminClient={adminClient}
  //         filterType={filterType}
  //         containerId={role.containerId}
  //       />
  //     </>
  //   );
  // };

  useEffect(() => {
    refresh();
  }, [filterType]);

  return (
    <Modal
      title={t("users:joinGroups", { name })}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
          key="add"
          data-testid="add-associated-roles-button"
          variant="primary"
          isDisabled={!selectedRows?.length}
          onClick={() => {
            props.toggleDialog();
            props.onConfirm(selectedRows);
            
          }}
        >
          {t("common:add")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            props.toggleDialog();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="groups:Groups"
        searchPlaceholderKey="groups:searchGroups"
        canSelectAll
        isPaginated
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            // cellRenderer: AliasRenderer,
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("groups:noGroupsInThisRealm")}
            instructions={t("groups:noGroupsInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            // onPrimaryAction={goToCreate}
          />
        }
      />
    </Modal>
  );
};
