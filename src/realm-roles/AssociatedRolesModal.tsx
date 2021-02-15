import React, { useEffect, useRef, useState } from "react";
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
import { boolFormatter } from "../util";
import { CaretDownIcon, FilterIcon } from "@patternfly/react-icons";
import { ClientRectObject } from "@patternfly/react-core/dist/js/helpers/Popper/thirdparty/popper-core";
import ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";

export type AssociatedRolesModalProps = {
  open: boolean;
  toggleDialog: () => void;
  onConfirm: (newReps: RoleRepresentation[]) => void;
  existingCompositeRoles: RoleRepresentation[];
};

const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length == 0) {
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

export const AssociatedRolesModal = (props: AssociatedRolesModalProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [clientIdArray, setClientIdArray] = useState<String[]>([]);
  const [allClientRoles, setAllClientRoles] = useState([]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("roles");

  const { id } = useParams<{ id: string }>();

  const loader = async () => {
    const allRoles = await adminClient.roles.find();
    const existingAdditionalRoles = await adminClient.roles.getCompositeRoles({
      id,
    });

    return allRoles.filter((role: RoleRepresentation) => {
      return (
        existingAdditionalRoles.find(
          (existing: RoleRepresentation) => existing.name === role.name
        ) === undefined && role.name !== name
      );
    });
  };


  const clientRolesLoader = async () => {
    const clients = await adminClient.clients.find();
    for (const client of Object.values(clients)) {

      setClientIdArray(clientIdArray => [...clientIdArray, client.id!])

    }

    for (const id of clientIdArray) {
      const clientRolesList = await adminClient.clients.listRoles({ id: id as string });

      
    }



    // console.log("these are client roles?", roles)
    // return roles.sort((r1, r2) => {
    //   const r1Name = r1.name?.toUpperCase();
    //   const r2Name = r2.name?.toUpperCase();
    //   if (r1Name! < r2Name!) {
    //     return -1;
    //   }
    //   if (r1Name! > r2Name!) {
    //     return 1;
    //   }

    //   return 0;
    // });
  };

  

  useEffect(() => {
    (async () => {
      if (id) {
        const fetchedRole = await adminClient.roles.findOneById({ id });
        setName(fetchedRole.name!);
        setupForm(fetchedRole);
          clientRolesLoader();

      } else {
        setName(t("createRole"));
      }
      // console.log(filterType)
    })();
  }, [filterType]);

  const setupForm = (role: RoleRepresentation) => {
    Object.entries(role).map((entry) => {
      if (entry[0] === "attributes") {
        form.setValue(entry[0], attributesToArray(entry[1]));
      } else {
        form.setValue(entry[0], entry[1]);
      }
    });
  };

  const onFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const onFilterDropdownSelect = (filterType: string) => {
    filterType == "roles" ? setFilterType("clients") : "";
    filterType == "clients" ? setFilterType("roles") : "";
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  console.log("clientIdarray", clientIdArray)
  console.log("allClientRoles???",clientRolesList)



  return (
    <Modal
      title={t("roles:associatedRolesModalTitle", { name })}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
          key="add"
          id="add-associated-roles-button"
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
        key="role-list-modal"
        loader={filterType == "roles" ? loader : loader}
        ariaLabelKey="roles:roleList"
        searchPlaceholderKey="roles:searchFor"
        filterToolbarDropdown={
          <Dropdown
            onSelect={() => onFilterDropdownSelect(filterType)}
            toggle={
              <DropdownToggle
                id="toggle-id-9"
                onToggle={onFilterDropdownToggle}
                toggleIndicator={CaretDownIcon}
                icon={<FilterIcon />}
              >
                Filter by {filterType}
              </DropdownToggle>
            }
            isOpen={isFilterDropdownOpen}
            dropdownItems={[
              <DropdownItem key="filter-type">
                {filterType == "roles" ? t("filterByClients") : t("filterByRoles")}{" "}
              </DropdownItem>,
            ]}
          />
        }
        canSelectAll
        // isPaginated
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            displayKey: "roles:roleName",
          },
          {
            name: "composite",
            displayKey: "roles:composite",
            cellFormatters: [boolFormatter()],
          },
          {
            name: "description",
            displayKey: "roles:description",
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noRolesInThisRealm")}
            instructions={t("noRolesInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            // onPrimaryAction={goToCreate}
          />
        }
      />
    </Modal>
  );
};
