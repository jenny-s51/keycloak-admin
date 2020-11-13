import {
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../components/help-enabler/HelpItem";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserFederationKerberosRequiredRepresentation } from "./models/user-federation";

export const KerberosSettingsRequired = () => {
  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;

  const [isEditModeDropdownOpen, setIsEditModeDropdownOpen] = useState(false);
  const { register, handleSubmit, control } = useForm<
    UserFederationKerberosRequiredRepresentation
  >();
  const onSubmit = (data: UserFederationKerberosRequiredRepresentation) => {
    console.log(data);
  };

  return (
    <>
      {/* Required settings */}
      <Form isHorizontal onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label={t("consoleDisplayName")}
          labelIcon={
            <HelpItem
              helpText={helpText("consoleDisplayNameHelp")}
              forLabel={t("consoleDisplayName")}
              forID="kc-console-display-name"
            />
          }
          fieldId="kc-console-display-name"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-console-display-name"
            name="consoleDisplayName"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("kerberosRealm")}
          labelIcon={
            <HelpItem
              helpText={helpText("kerberosRealmHelp")}
              forLabel={t("kerberosRealm")}
              forID="kc-kerberos-realm"
            />
          }
          fieldId="kc-kerberos-realm"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-kerberos-realm"
            name="kerberosRealm"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("serverPrincipal")}
          labelIcon={
            <HelpItem
              helpText={helpText("serverPrincipalHelp")}
              forLabel={t("serverPrincipal")}
              forID="kc-server-principal"
            />
          }
          fieldId="kc-server-principal"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-server-principal"
            name="serverPrincipal"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("keyTab")}
          labelIcon={
            <HelpItem
              helpText={helpText("keyTabHelp")}
              forLabel={t("keyTab")}
              forID="kc-key-tab"
            />
          }
          fieldId="kc-key-tab"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-key-tab"
            name="keyTab"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("debug")}
          labelIcon={
            <HelpItem
              helpText={helpText("debugHelp")}
              forLabel={t("debug")}
              forID="kc-debug"
            />
          }
          fieldId="kc-debug"
          hasNoPaddingTop
        >
          {" "}
          <Controller
            name="debug"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-debug"}
                isDisabled={false}
                onChange={onChange}
                isChecked={value}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("allowPasswordAuthentication")}
          labelIcon={
            <HelpItem
              helpText={helpText("allowPasswordAuthenticationHelp")}
              forLabel={t("allowPasswordAuthentication")}
              forID="kc-allow-password-authentication"
            />
          }
          fieldId="kc-allow-password-authentication"
          hasNoPaddingTop
        >
          <Controller
            name="allowPasswordAuthentication"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-allow-password-authentication"}
                isDisabled={false}
                onChange={onChange}
                isChecked={value}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("editMode")}
          labelIcon={
            <HelpItem
              helpText={helpText("editModeHelp")}
              forLabel={t("editMode")}
              forID="kc-edit-mode"
            />
          }
          fieldId="kc-edit-mode"
        >
          {" "}
          <Controller
            name="editMode"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-edit-mode"
                required
                onToggle={() =>
                  setIsEditModeDropdownOpen(!isEditModeDropdownOpen)
                }
                isOpen={isEditModeDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsEditModeDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="Choose..." isPlaceholder />
                <SelectOption key={1} value="UNSYNCED" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("updateFirstLogin")}
          labelIcon={
            <HelpItem
              helpText={helpText("updateFirstLoginHelp")}
              forLabel={t("updateFirstLogin")}
              forID="kc-update-first-login"
            />
          }
          fieldId="kc-update-first-login"
          hasNoPaddingTop
        >
          <Controller
            name="updateFirstLogin"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-update-first-login"}
                isDisabled={false}
                onChange={onChange}
                isChecked={value}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>
        <button type="submit">Test submit</button>
      </Form>
    </>
  );
};
