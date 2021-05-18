import React, { Component, useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";



type AddProviderModalProps = {
  id?: string;
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save?: () => void;
};

export const AddProviderModal = ({
  id,
  providerType,
  handleModalToggle,
  refresh,
  save,
}: AddProviderModalProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { register, errors, handleSubmit, control } = useForm({
    // defaultValues: { name: rename },
  });
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const providerTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ].map((item) => item.id);
  
  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];


//   const handleModalToggle = () => {
//     setIsModalOpen(!isModalOpen);
//   };

const [AESkeySize, setAESkeySize] = useState("");

  const submitForm = async (component: ComponentRepresentation) => {
    console.log("viz")

    try {
    //   if (!id) {
        await adminClient.components.create(component);
    //   } else if (rename) {
    //     await adminClient.groups.update({ id }, group);
    //   } else {
    //     await adminClient.groups.setOrCreateChild({ id }, group);
    //   }

    //   refresh(rename ? group : undefined);
      refresh();
      handleModalToggle!();
      addAlert(
        t("created!!!!"),
        AlertVariant.success
      );
    } catch (error) {
      addAlert(t("couldNotCreate", { error }), AlertVariant.danger);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("realm-settings:addProvider")}
      isOpen={true}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid={"add-provider"}
          key="confirm"
          variant="primary"
          type="submit"
          form="add-provider"
        //   onClick={() => submitForm}
        >
          {t("common:Add")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            handleModalToggle!();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
       <Form
          isHorizontal
        //   role="manage-realm"
          id="add-provider"
          className="pf-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("realm-settings:consoleDisplayName")}
            fieldId="kc-login-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:loginTheme"
                forLabel={t("loginTheme")}
                forID="kc-login-theme"
              />
            }
          >
            <Controller
              name="name"
              control={control}
              defaultValue={providerType}
              render={({ onChange, value }) => (
                <TextInput
                  // variant={SelectVariant.single}
                  aria-label={t("consoleDisplayName")}
                  // isOpen={loginThemeOpen}
                  defaultValue={providerType}
                  data-testid="select-display-name"
                ></TextInput>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("common:enabled")}
            fieldId="kc-account-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:accountTheme"
                forLabel={t("accountTheme")}
                forID="kc-account-theme"
              />
            }
          >
            <Controller
              name="config.enabled"
              control={control}
              defaultValue={false}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-enabled"
                  label={t("common:enabled")}
                  labelOff={t("common:disabled")}
                  isChecked={value}
                  data-testid={
                    value
                      ? "internationalization-enabled"
                      : "internationalization-disabled"
                  }
                  onChange={(onChange)}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("realm-settings:active")}
            fieldId="kc-admin-console-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:adminConsoleTheme"
                forLabel={t("adminTheme")}
                forID="kc-admin-console-theme"
              />
            }
          >
             <Controller
              name="config.active"
              control={control}
              defaultValue={false}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-active"
                  label={t("common:enabled")}
                  labelOff={t("common:disabled")}
                  isChecked={value}
                  data-testid={
                    value
                      ? "internationalization-enabled"
                      : "internationalization-disabled"
                  }
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          {providerType === ("rsa" || "rsa-generated") && (
            <FormGroup
              label={t("realm-settings:algorithm")}
              fieldId="kc-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:emailTheme"
                  forLabel={t("emailTheme")}
                  forID="kc-email-theme"
                />
              }
            >
              <Controller
                name="emailTheme"
                // control={control}
                defaultValue=""
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-email-theme"
                    onToggle={() => {}}
                    onSelect={(_, value) => {
                      onChange(value as string);
                      // setEmailThemeOpen(false);
                    }}
                    selections={value}
                    variant={SelectVariant.single}
                    aria-label={t("emailTheme")}
                    // isOpen={emailThemeOpen}
                    // placeholderText="Select a theme"
                    data-testid="select-email-theme"
                  >
                    {/* {themeTypes.email.map((theme, idx) => (
                    <SelectOption
                      selected={theme.name === value}
                      key={`email-theme-${idx}`}
                      value={theme.name}
                    >
                      {t(`${theme.name}`)}
                    </SelectOption>
                  ))} */}
                  </Select>
                )}
              />
            </FormGroup>
          )}

          {providerType === "aes-generated" && (
            <FormGroup
              label={t("realm-settings:AESKeySize")}
              fieldId="kc-aes-keysize"
              // labelIcon={
              //   <HelpItem
              //     helpText="realm-settings-help:emailTheme"
              //     forLabel={t("emailTheme")}
              //     forID="kc-email-theme"
              //   />
              // }
            >
              <Controller
                name="config.secretSize"
                control={control}
                defaultValue=""
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-aes-keysize"
                    onToggle={() =>
                      setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)
                    }
                    onSelect={(_, value) => {
                      onChange(value as string);
                      setAESkeySize(value as string);
                      setIsKeySizeDropdownOpen(false);
                    }}
                    selections={AESkeySize}
                    isOpen={isKeySizeDropdownOpen}
                    variant={SelectVariant.single}
                    aria-label={t("aesKeySize")}
                    placeholderText="Select one..."
                    data-testid="select-secret-size"
                  >
                    {allComponentTypes[0].properties[3].options!.map(
                      (item, idx) => (
                        <SelectOption
                          selected={item === value}
                          key={`email-theme-${idx}`}
                          value={item}
                        />
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
          )}
          {providerType === "ecdsa-generated" && (
            <FormGroup
              label={t("realm-settings:ellipticCurve")}
              fieldId="kc-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:emailTheme"
                  forLabel={t("emailTheme")}
                  forID="kc-email-theme"
                />
              }
            >
              <Controller
                name="ecdsaEllipticCurveKey"
                control={control}
                defaultValue=""
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-elliptic"
                    onToggle={() => {}}
                    onSelect={(_, value) => {
                      onChange(value as string);
                      // setEmailThemeOpen(false);
                    }}
                    selections={value}
                    variant={SelectVariant.single}
                    aria-label={t("emailTheme")}
                    isOpen={true}
                    placeholderText="Select one..."
                    data-testid="select-email-theme"
                  >
                    {allComponentTypes[1].properties[3].options!.map((p, idx) => (
                      <SelectOption
                        selected={p === value}
                        key={`email-theme-${idx}`}
                        value={p}
                      >

                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
            </FormGroup>
          )}
        </Form>
    </Modal>
  );
};
