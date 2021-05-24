import React, { Component, useState, useEffect } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  FileUpload,
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
import { useRealm } from "../context/realm-context/RealmContext";

type AddProviderModalProps = {
  id?: string;
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  open: boolean;
  // save?: () => void;
};

export const AddProviderModal = ({
  id,
  providerType,
  handleModalToggle,
  open,
}: // refresh,
// save,
AddProviderModalProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { register, errors, handleSubmit, control } = useForm({
    // defaultValues: { name: rename },
  });
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);
  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);
  const [isRSAalgDropdownOpen, setIsRSAalgDropdownOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const realm = useRealm();

  const providerTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ].map((item) => item.id);

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  useEffect(() => {
    console.log("refreshed");
  }, [key]);

  const [AESkeySize, setAESkeySize] = useState<string[]>(["16"]);
  console.log("coooomponent", allComponentTypes);

  const save = async (component: ComponentRepresentation) => {
    try {
      await adminClient.components.create({
        parentId: realm.realm,
        name: displayName !== "" ? displayName : providerType,
        providerId: providerType,
        providerType: "org.keycloak.keys.KeyProvider",
        ...component,
      });
      refresh();
      addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
      handleModalToggle!();
    } catch (error) {
      console.log("iooops", error.response.data.errorMessage);
      addAlert(
        t("realm-settings:saveProviderError") +
          error.response?.data?.errorMessage || error,
        // , {
        //   error: error.response?.data?.errorMessage || error,
        // }),
        AlertVariant.danger
      );
    }
  };

  console.log("troy", allComponentTypes[0].properties[3].options[1]);

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("realm-settings:addProvider")}
      isOpen={open}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid={"add-provider"}
          key="confirm"
          variant="primary"
          type="submit"
          form="add-provider"
          // onClick={() => handleModalToggle!()}
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
        onSubmit={handleSubmit(save!)}
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
                onChange={(value) => {
                  onChange(value);
                  console.log("good day in my mind", displayName);
                  console.log("value", value);
                  setDisplayName(value);
                }}
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
            defaultValue={["true"]}
            render={({ onChange, value }) => (
              <Switch
                id="kc-enabled"
                label={t("common:enabled")}
                labelOff={t("common:disabled")}
                isChecked={value[0] === "true"}
                data-testid={
                  value[0] === "true"
                    ? "internationalization-enabled"
                    : "internationalization-disabled"
                }
                onChange={(value) => {
                  onChange([value + ""]);
                }}
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
            defaultValue={["true"]}
            render={({ onChange, value }) => (
              <Switch
                id="kc-active"
                label={t("common:enabled")}
                labelOff={t("common:disabled")}
                isChecked={value[0] === "true"}
                data-testid={
                  value[0] === "true"
                    ? "internationalization-enabled"
                    : "internationalization-disabled"
                }
                onChange={(value) => {
                  onChange([value + ""]);
                }}
              />
            )}
          />
        </FormGroup>
        {providerType === "rsa" && (
          <>
            <FormGroup
              label={t("realm-settings:algorithm")}
              fieldId="kc-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:algorithm"
                  forLabel={t("algorithm")}
                  forID="kc-algorithm"
                />
              }
            >
              <Controller
                name="algorithm"
                // control={control}
                defaultValue=""
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-rsa-algorithm"
                    onToggle={() =>
                      setIsRSAalgDropdownOpen(!isRSAalgDropdownOpen)
                    }
                    onSelect={(_, value) => {
                      onChange(value as string);
                      setIsRSAalgDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    variant={SelectVariant.single}
                    aria-label={t("algorithm")}
                    isOpen={isRSAalgDropdownOpen}
                    // placeholderText="Select a theme"
                    data-testid="select-rsa-algorithm"
                  >
                    {allComponentTypes[4].properties[3].options!.map(
                      (p, idx) => (
                        <SelectOption
                          selected={p === value}
                          key={`rsa-algorithm-${idx}`}
                          value={p}
                        ></SelectOption>
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:privateRSAKey")}
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
                name="config.privateKey"
                control={control}
                defaultValue={[]}
                render={({ onChange, value, idx }) => (
                  <FileUpload
                    id="importFile"
                    type="text"
                    value={value.value}
                    filename={value.filename}
                    // onChange={(value) => {
                    //   console.log("dddd", typeof value);
                    //   onChange({value});

                    // }}
                    onChange={(value, filename) => onChange({ value, filename })}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:x509Certificate")}
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
                name="config.certificate"
                control={control}
                defaultValue={[]}
                render={({ onChange, value }) => (
                  <FileUpload
                    id="importFile"
                    type="text"
                    value={value.value}
                    filename={value.filename}
                    // onChange={(value) => {
                    //   console.log("therapy", value);
                    //   onChange({ value });
                    // }}
                    onChange={(value) => {
                      onChange([value + ""]);
                    }}
                  />
                )}
              />
            </FormGroup>
          </>
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
              defaultValue={["16"]}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-aes-keysize"
                  onToggle={() =>
                    setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)
                  }
                  onSelect={(_, value) => {
                    onChange([value + ""]);
                    setAESkeySize([value + ""]);
                    setIsKeySizeDropdownOpen(false);
                  }}
                  selections={AESkeySize}
                  isOpen={isKeySizeDropdownOpen}
                  variant={SelectVariant.single}
                  aria-label={t("aesKeySize")}
                  // placeholderText="Select one..."
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
              name="config.ecdsaEllipticCurveKey"
              control={control}
              defaultValue={["P-256"]}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-elliptic"
                  onToggle={() =>
                    setIsEllipticCurveDropdownOpen(!isEllipticCurveDropdownOpen)
                  }
                  onSelect={(_, value) => {
                    onChange([value + ""]);
                    setIsEllipticCurveDropdownOpen(false);
                  }}
                  selections={[value + ""]}
                  variant={SelectVariant.single}
                  aria-label={t("emailTheme")}
                  isOpen={isEllipticCurveDropdownOpen}
                  placeholderText="Select one..."
                  data-testid="select-email-theme"
                >
                  {allComponentTypes[1].properties[3].options!.map((p, idx) => (
                    <SelectOption
                      selected={p === value}
                      key={`email-theme-${idx}`}
                      value={p}
                    ></SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
        )}
        {providerType === "hmac-generated" && (
          <>
            <FormGroup
              label={t("realm-settings:secretSize")}
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
                defaultValue={["64"]}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-aes-keysize"
                    onToggle={() =>
                      setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)
                    }
                    onSelect={(_, value) => {
                      onChange([value + ""]);
                      setAESkeySize([value + ""]);
                      setIsKeySizeDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    isOpen={isKeySizeDropdownOpen}
                    variant={SelectVariant.single}
                    aria-label={t("aesKeySize")}
                    // placeholderText="Select one..."
                    data-testid="select-secret-size"
                  >
                    {allComponentTypes[2].properties[3].options!.map(
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
                name="config.algorithm"
                control={control}
                defaultValue={["HS-256"]}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-elliptic"
                    onToggle={() =>
                      setIsEllipticCurveDropdownOpen(
                        !isEllipticCurveDropdownOpen
                      )
                    }
                    onSelect={(_, value) => {
                      onChange([value + ""]);
                      setIsEllipticCurveDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    variant={SelectVariant.single}
                    aria-label={t("emailTheme")}
                    isOpen={isEllipticCurveDropdownOpen}
                    placeholderText="Select one..."
                    data-testid="select-email-theme"
                  >
                    {allComponentTypes[2].properties[4].options!.map(
                      (p, idx) => (
                        <SelectOption
                          selected={p === value}
                          key={`email-theme-${idx}`}
                          value={p}
                        ></SelectOption>
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
          </>
        )}
        {providerType === "java-keystore" && (
          <>
            <FormGroup
              label={t("realm-settings:algorithm")}
              fieldId="kc-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:algorithm"
                  forLabel={t("algorithm")}
                  forID="kc-email-theme"
                />
              }
            >
              <Controller
                name="config.algorithm"
                control={control}
                defaultValue={["RS256"]}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-elliptic"
                    onToggle={() =>
                      setIsEllipticCurveDropdownOpen(
                        !isEllipticCurveDropdownOpen
                      )
                    }
                    onSelect={(_, value) => {
                      onChange([value + ""]);
                      setIsEllipticCurveDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    variant={SelectVariant.single}
                    aria-label={t("algorithm")}
                    isOpen={isEllipticCurveDropdownOpen}
                    placeholderText="Select one..."
                    data-testid="select-algorithm"
                  >
                    {allComponentTypes[3].properties[3].options!.map(
                      (p, idx) => (
                        <SelectOption
                          selected={p === value}
                          key={`algorithm-${idx}`}
                          value={p}
                        ></SelectOption>
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:keystore")}
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
                name="config.keystore"
                control={control}
                defaultValue={[]}
                render={({ onChange, value }) => (
                  <TextInput
                    // variant={SelectVariant.single}
                    aria-label={t("keystore")}
                    // isOpen={loginThemeOpen}
                    // defaultValue={[]}
                    onChange={(value) => {
                      onChange([value + ""]);
                      console.log("good day in my mind", displayName);
                      console.log("value", value);
                      // setDisplayName(value);
                    }}
                    data-testid="select-display-name"
                  ></TextInput>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:keystorePassword")}
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
                name="config.keystorePassword"
                control={control}
                defaultValue={[]}
                render={({ onChange, value }) => (
                  <TextInput
                    // variant={SelectVariant.single}
                    aria-label={t("consoleDisplayName")}
                    // isOpen={loginThemeOpen}
                    // defaultValue=""
                    onChange={(value) => {
                      onChange([value + ""]);
                      console.log("good day in my mind", displayName);
                      console.log("value", value);
                      setDisplayName(value);
                    }}
                    data-testid="select-display-name"
                  ></TextInput>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:keyAlias")}
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
                name="config.keyAlias"
                control={control}
                defaultValue={[]}
                render={({ onChange, value }) => (
                  <TextInput
                    // variant={SelectVariant.single}
                    aria-label={t("consoleDisplayName")}
                    // isOpen={loginThemeOpen}
                    // defaultValue=""
                    onChange={(value) => {
                      onChange([value + ""]);
                      console.log("good day in my mind", displayName);
                      console.log("value", value);
                      // setDisplayName(value);
                    }}
                    data-testid="select-display-name"
                  ></TextInput>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:keyPassword")}
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
                name="config.keyPassword"
                control={control}
                defaultValue={[]}
                render={({ onChange, value }) => (
                  <TextInput
                    // variant={SelectVariant.single}
                    aria-label={t("consoleDisplayName")}
                    // isOpen={loginThemeOpen}
                    // defaultValue=""
                    onChange={(value) => {
                      onChange([value + ""]);
                      console.log("good day in my mind", displayName);
                      console.log("value", value);
                      setDisplayName(value);
                    }}
                    data-testid="select-display-name"
                  ></TextInput>
                )}
              />
            </FormGroup>
          </>
        )}
      </Form>
    </Modal>
  );
};
