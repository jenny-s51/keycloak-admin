import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  DataList,
  DataListCell,
  DataListControl,
  DataListDragButton,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  InputGroup,
  ModalVariant,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import type { KeyMetadataRepresentation } from "keycloak-admin/lib/defs/keyMetadataRepresentation";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import "./RealmSettingsSection.css";
import type ComponentTypeRepresentation from "keycloak-admin/lib/defs/componentTypeRepresentation";
import { SearchIcon } from "@patternfly/react-icons";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { Controller, useForm } from "react-hook-form";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { FormAccess } from "../components/form-access/FormAccess";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { AddProviderModal } from "./AddProviderModal";
import { getLastId } from "../groups/groupIdUtils";
import { useRealm } from "../context/realm-context/RealmContext";

type ComponentData = KeyMetadataRepresentation & {
  providerDescription?: string;
  name?: string;
};

type KeysTabInnerProps = {
  components: ComponentData[];
  realmComponents: ComponentRepresentation[];
  keyProviderComponentTypes: ComponentTypeRepresentation[];
};

export const KeysTabInner = ({ components }: KeysTabInnerProps) => {
  const { t } = useTranslation("roles");
  const realm = useRealm();

  const [id, setId] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [val, setVal] = useState("");
  const [filteredComponents, setFilteredComponents] = useState<ComponentData[]>(
    []
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const serverInfo = useServerInfo();
  const providerTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ].map((item) => item.id);

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  console.log("new light", allComponentTypes);
  const adminClient = useAdminClient();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  // let beep = allComponentTypes[0].properties[3].options!
  const { register, errors, setValue, control, handleSubmit } = useForm();
  const { addAlert } = useAlerts();

  const itemIds = components.map((item, idx) => "data" + idx);

  const [itemOrder, setItemOrder] = useState<string[]>([]);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);

  const [defaultConsoleDisplayName, setDefaultConsoleDisplayName] = useState(
    ""
  );

  const [liveText, setLiveText] = useState("");

  useEffect(() => {
    setItemOrder(["data", ...itemIds]);
  }, [components, searchVal, key]);

  const onDragStart = (id: string) => {
    setLiveText(t("onDragStart", { id }));
    setId(id);
  };

  const onDragMove = () => {
    setLiveText(t("onDragMove", { id }));
  };

  const onDragCancel = () => {
    setLiveText(t("onDragCancel"));
  };

  const onDragFinish = (itemOrder: string[]) => {
    setItemOrder(["data", ...itemOrder.filter((i) => i !== "data")]);
    setLiveText(t("onDragCancel"));
  };

  const onSearch = () => {
    if (searchVal !== "") {
      setSearchVal(searchVal);
      const x = components.filter((v) => {
        return v.name?.includes(searchVal) || v.providerId?.includes(searchVal);
      });
      setFilteredComponents(x);
    } else {
      setSearchVal("");
      setFilteredComponents(components);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleInputChange = (value: string) => {
    setSearchVal(value);
  };

  const handleModalToggle = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  return (
    <>
      {isCreateModalOpen && (
        <AddProviderModal
          handleModalToggle={handleModalToggle}
          providerType={defaultConsoleDisplayName}
          refresh={refresh}
          open={isCreateModalOpen}
          // save={save}
          id={id}
        />
      )}

      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <Toolbar>
          <>
            <ToolbarGroup className="providers-toolbar">
              <ToolbarItem>
                <InputGroup>
                  <TextInput
                    name={"inputGroupName"}
                    id={"inputGroupName"}
                    type="search"
                    aria-label={t("common:search")}
                    placeholder={t("common:search")}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    variant={ButtonVariant.control}
                    aria-label={t("common:search")}
                  >
                    <SearchIcon />
                  </Button>
                </InputGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  data-testid="addProviderDropdown"
                  className="add-provider-dropdown"
                  // onClick={() => toggleAddProviderModal()}
                  isOpen={providerDropdownOpen}
                  toggle={
                    <DropdownToggle
                      onToggle={(val) => setProviderDropdownOpen(val)}
                      isPrimary
                    >
                      {t("realm-settings:addProvider")}
                    </DropdownToggle>
                  }
                  dropdownItems={[
                    providerTypes.map((item) => (
                      <DropdownItem
                        onClick={() => {
                          handleModalToggle();

                          setProviderDropdownOpen(false);
                          setDefaultConsoleDisplayName(item);
                        }}
                        key={item}
                      >
                        {item}
                      </DropdownItem>
                    )),
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </>
        </Toolbar>

        <DataList
          aria-label={t("groups")}
          onDragFinish={onDragFinish}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragCancel={onDragCancel}
          itemOrder={itemOrder}
          isCompact
        >
          <DataListItem aria-labelledby={"aria"} id="data" key="data">
            <DataListItemRow className="test" data-testid={"data-list-row"}>
              <DataListDragButton
                className="header-drag-button"
                aria-label="Reorder"
                aria-labelledby="simple-item"
                aria-describedby="Press space or enter to begin dragging, and use the arrow keys to navigate up or down. Press enter to confirm the drag, or any other key to cancel the drag operation."
                aria-pressed="false"
                isDisabled
              />
              <DataListItemCells
                className="data-list-cells"
                dataListCells={[
                  <DataListCell className="name" key={"1"}>
                    <>{t("realm-settings:name")}</>
                  </DataListCell>,
                  <DataListCell className="provider" key={"2"}>
                    <>{t("realm-settings:provider")}</>
                  </DataListCell>,
                  <DataListCell className="provider-description" key={"3"}>
                    <>{t("realm-settings:providerDescription")}</>
                  </DataListCell>,
                  <DataListCell key={"2"}>
                    <>{t("realm-settings:provider")}</>
                  </DataListCell>,
                  <DataListCell className="provider-description" key={"3"}>
                    <>{t("realm-settings:providerDescription")}</>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          {(filteredComponents.length === 0
            ? components
            : filteredComponents
          ).map((component, idx) => (
            <DataListItem
              draggable
              aria-labelledby={"aria"}
              key={`data${idx}`}
              id={`data${idx}`}
            >
              <DataListItemRow data-testid={"data-list-row"}>
                <DataListControl>
                  <DataListDragButton
                    className="row-drag-button"
                    aria-label="Reorder"
                    aria-labelledby="simple-item2"
                    aria-describedby="Press space or enter to begin dragging, and use the arrow keys to navigate up or down. Press enter to confirm the drag, or any other key to cancel the drag operation."
                    aria-pressed="false"
                  />
                </DataListControl>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key={"4"}>
                      <>
                        <Button variant="link">{component.providerId}</Button>
                      </>
                    </DataListCell>,
                    <DataListCell key={"5"}>
                      <>{component.name}</>
                    </DataListCell>,
                    <DataListCell key={"6"}>
                      <>{component.providerDescription}</>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
        <div className="pf-screen-reader" aria-live="assertive">
          {liveText}
        </div>
      </PageSection>
    </>
  );
};

type KeysProps = {
  components: ComponentRepresentation[];
  realmComponents: ComponentRepresentation[];
  keyProviderComponentTypes: ComponentTypeRepresentation[];
};

export const KeysProviderTab = ({
  components,
  keyProviderComponentTypes,
  ...props
}: KeysProps) => {
  return (
    <KeysTabInner
      components={components?.map((component) => {
        const provider = keyProviderComponentTypes.find(
          (componentType: ComponentTypeRepresentation) =>
            component.providerId === componentType.id
        );
        return { ...component, providerDescription: provider?.helpText };
      })}
      keyProviderComponentTypes={keyProviderComponentTypes}
      {...props}
    />
  );
};
