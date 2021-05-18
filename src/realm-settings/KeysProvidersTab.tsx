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

  // const id = getLastId(location.pathname);

  const save = async (component: ComponentRepresentation) => {
    try {
      await adminClient.components.create(
        {
          parentId: realm,
          providerId: component.providerId,
          providerType: "org.keycloak.keys.keyProvider",
        },
      );
      addAlert(t("saveRealmSuccess"), AlertVariant.success);

      // history.push(`/${realm.realm}`);
    } catch (error) {
      addAlert(
        t("saveRealmError", {
          error: error.response?.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };

  // const [toggleAddProviderModal, AddProviderModal] = useConfirmDialog({
  //   titleKey: t("realm-settings:addProvider"),
  //   // messageKey: "common:add",
  //   variant: ModalVariant.medium,
  //   className: "add-provider-modal",
  //   continueButtonLabel: "common:add",
  //   continueButtonVariant: ButtonVariant.primary,
  //   children: (
  //     <>
  //       <FormAccess
  //         isHorizontal
  //         role="manage-realm"
  //         className="pf-u-mt-lg"
  //         // onSubmit={handleSubmit(save)}
  //       >
  //         <FormGroup
  //           label={t("realm-settings:consoleDisplayName")}
  //           fieldId="kc-login-theme"
  //           labelIcon={
  //             <HelpItem
  //               helpText="realm-settings-help:loginTheme"
  //               forLabel={t("loginTheme")}
  //               forID="kc-login-theme"
  //             />
  //           }
  //         >
  //           <Controller
  //             name="name"
  //             control={control}
  //             defaultValue=""
  //             render={({ onChange, value }) => (
  //               <TextInput
  //                 // variant={SelectVariant.single}
  //                 aria-label={t("consoleDisplayName")}
  //                 // isOpen={loginThemeOpen}
  //                 defaultValue={defaultConsoleDisplayName}
  //                 data-testid="select-display-name"
  //               ></TextInput>
  //             )}
  //           />
  //         </FormGroup>
  //         <FormGroup
  //           label={t("common:enabled")}
  //           fieldId="kc-account-theme"
  //           labelIcon={
  //             <HelpItem
  //               helpText="realm-settings-help:accountTheme"
  //               forLabel={t("accountTheme")}
  //               forID="kc-account-theme"
  //             />
  //           }
  //         >
  //           <Controller
  //             name="enabled"
  //             control={control}
  //             defaultValue={false}
  //             render={({ onChange, value }) => (
  //               <Switch
  //                 id="kc-enabled"
  //                 label={t("common:enabled")}
  //                 labelOff={t("common:disabled")}
  //                 isChecked={value}
  //                 data-testid={
  //                   value
  //                     ? "internationalization-enabled"
  //                     : "internationalization-disabled"
  //                 }
  //                 onChange={(onChange)}
  //               />
  //             )}
  //           />
  //         </FormGroup>
  //         <FormGroup
  //           label={t("realm-settings:active")}
  //           fieldId="kc-admin-console-theme"
  //           labelIcon={
  //             <HelpItem
  //               helpText="realm-settings-help:adminConsoleTheme"
  //               forLabel={t("adminTheme")}
  //               forID="kc-admin-console-theme"
  //             />
  //           }
  //         >
  //           <Controller
  //             name="active"
  //             control={control}
  //             defaultValue={false}
  //             render={({ onChange, value }) => (
  //               <Switch
  //                 id="kc-active"
  //                 label={t("common:enabled")}
  //                 labelOff={t("common:disabled")}
  //                 isChecked={value}
  //                 data-testid={
  //                   value
  //                     ? "internationalization-enabled"
  //                     : "internationalization-disabled"
  //                 }
  //                 onChange={onChange}
  //               />
  //             )}
  //           />
  //         </FormGroup>
  //         {defaultConsoleDisplayName === ("rsa" || "rsa-generated") && (
  //           <FormGroup
  //             label={t("realm-settings:algorithm")}
  //             fieldId="kc-algorithm"
  //             labelIcon={
  //               <HelpItem
  //                 helpText="realm-settings-help:emailTheme"
  //                 forLabel={t("emailTheme")}
  //                 forID="kc-email-theme"
  //               />
  //             }
  //           >
  //             <Controller
  //               name="emailTheme"
  //               // control={control}
  //               defaultValue=""
  //               render={({ onChange, value }) => (
  //                 <Select
  //                   toggleId="kc-email-theme"
  //                   onToggle={() => {}}
  //                   onSelect={(_, value) => {
  //                     onChange(value as string);
  //                     // setEmailThemeOpen(false);
  //                   }}
  //                   selections={value}
  //                   variant={SelectVariant.single}
  //                   aria-label={t("emailTheme")}
  //                   // isOpen={emailThemeOpen}
  //                   // placeholderText="Select a theme"
  //                   data-testid="select-email-theme"
  //                 >
  //                   {/* {themeTypes.email.map((theme, idx) => (
  //                   <SelectOption
  //                     selected={theme.name === value}
  //                     key={`email-theme-${idx}`}
  //                     value={theme.name}
  //                   >
  //                     {t(`${theme.name}`)}
  //                   </SelectOption>
  //                 ))} */}
  //                 </Select>
  //               )}
  //             />
  //           </FormGroup>
  //         )}

  //         {defaultConsoleDisplayName === "aes-generated" && (
  //           <FormGroup
  //             label={t("realm-settings:AESKeySize")}
  //             fieldId="kc-aes-keysize"
  //             // labelIcon={
  //             //   <HelpItem
  //             //     helpText="realm-settings-help:emailTheme"
  //             //     forLabel={t("emailTheme")}
  //             //     forID="kc-email-theme"
  //             //   />
  //             // }
  //           >
  //             <Controller
  //               name="secretSize"
  //               control={control}
  //               defaultValue=""
  //               render={({ onChange, value }) => (
  //                 <Select
  //                   toggleId="kc-aes-keysize"
  //                   onToggle={() =>
  //                     setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)
  //                   }
  //                   onSelect={(_, value) => {
  //                     onChange(value as string);
  //                     setVal(value as string);
  //                     setIsKeySizeDropdownOpen(false);
  //                   }}
  //                   selections={val}
  //                   isOpen={isKeySizeDropdownOpen}
  //                   variant={SelectVariant.single}
  //                   aria-label={t("aesKeySize")}
  //                   placeholderText="Select one..."
  //                   data-testid="select-secret-size"
  //                 >
  //                   {allComponentTypes[0].properties[3].options!.map(
  //                     (item, idx) => (
  //                       <SelectOption
  //                         selected={item === value}
  //                         key={`email-theme-${idx}`}
  //                         value={item}
  //                       />
  //                     )
  //                   )}
  //                 </Select>
  //               )}
  //             />
  //           </FormGroup>
  //         )}
  //         {defaultConsoleDisplayName === "ecdsa-generated" && (
  //           <FormGroup
  //             label={t("realm-settings:ellipticCurve")}
  //             fieldId="kc-algorithm"
  //             labelIcon={
  //               <HelpItem
  //                 helpText="realm-settings-help:emailTheme"
  //                 forLabel={t("emailTheme")}
  //                 forID="kc-email-theme"
  //               />
  //             }
  //           >
  //             <Controller
  //               name="ecdsaEllipticCurveKey"
  //               control={control}
  //               defaultValue=""
  //               render={({ onChange, value }) => (
  //                 <Select
  //                   toggleId="kc-elliptic"
  //                   onToggle={() => {}}
  //                   onSelect={(_, value) => {
  //                     onChange(value as string);
  //                     // setEmailThemeOpen(false);
  //                   }}
  //                   selections={value}
  //                   variant={SelectVariant.single}
  //                   aria-label={t("emailTheme")}
  //                   isOpen={true}
  //                   placeholderText="Select one..."
  //                   data-testid="select-email-theme"
  //                 >
  //                   {allComponentTypes[1].properties[3].options!.map((p, idx) => (
  //                     <SelectOption
  //                       selected={p === value}
  //                       key={`email-theme-${idx}`}
  //                       value={p}
  //                     >

  //                     </SelectOption>
  //                   ))}
  //                 </Select>
  //               )}
  //             />
  //           </FormGroup>
  //         )}
  //       </FormAccess>
  //     </>
  //   ),
  //   onConfirm: async () => {
  //     try {
  //       // for (const scope of selectedScopes) {
  //         // await adminClient.components.create(provider);
  //         save()
  //         // }
  //       // addAlert(t("deletedSuccess"), AlertVariant.success);
  //       // refresh();
  //     } catch (error) {
  //       // addAlert(
  //       //   t("deleteError", {
  //       //     error: error.response?.data?.errorMessage || error,
  //       //   }),
  //       //   AlertVariant.danger
  //       // );
  //     }
  //   },
  // });

  return (
    <>
      {isCreateModalOpen && (
        <AddProviderModal
          handleModalToggle={handleModalToggle}
          providerType={defaultConsoleDisplayName}
          refresh={refresh}
          save={save}
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
