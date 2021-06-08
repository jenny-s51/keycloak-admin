import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  ActionGroup,
  Button,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextContent,
} from "@patternfly/react-core";

import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { FormAccess } from "../components/form-access/FormAccess";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { FormPanel } from "../components/scroll-form/FormPanel";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { getBaseUrl } from "../util";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { SearchIcon } from "@patternfly/react-icons";

type LocalizationTabProps = {
  save: (realm: RealmRepresentation) => void;
  reset: () => void;
  refresh: () => void;
  realm: RealmRepresentation;
};

export const LocalizationTab = ({
  save,
  reset,
  realm,
}: LocalizationTabProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const [key, setKey] = useState(0);

  const [supportedLocalesOpen, setSupportedLocalesOpen] = useState(false);
  const [defaultLocaleOpen, setDefaultLocaleOpen] = useState(false);

  const { control, handleSubmit } = useFormContext();
  const [selectedLocale, setSelectedLocale] = useState("en");
  const themeTypes = useServerInfo().themes!;

  const watchSupportedLocales = useWatch({
    control,
    name: "supportedLocales",
    defaultValue: themeTypes?.account![0].locales,
  });

  const internationalizationEnabled = useWatch({
    control,
    name: "internationalizationEnabled",
    defaultValue: false,
  });

  const loader = async () => {
    if (realm) {
      const response = await fetch(
        `${getBaseUrl(adminClient)}admin/realms/${
          realm.realm
        }/localization/${selectedLocale}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${await adminClient.getAccessToken()}`,
          },
        }
      );

      const result = await response.json();
      const resultTest = Object.keys(result).map((key) => [key, result[key]]);
      return resultTest;
    }
    return [[]];
  };

  return (
    <>
      <PageSection variant="light">
        <FormPanel
          className="kc-login-screen"
          title="Login screen customization"
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              label={t("internationalization")}
              fieldId="kc-internationalization"
            >
              <Controller
                name="internationalizationEnabled"
                control={control}
                defaultValue={realm?.internationalizationEnabled}
                render={({ onChange, value }) => (
                  <Switch
                    id="kc-l-internationalization"
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
            {internationalizationEnabled && (
              <>
                <FormGroup
                  label={t("supportedLocales")}
                  fieldId="kc-l-supported-locales"
                >
                  <Controller
                    name="supportedLocales"
                    control={control}
                    defaultValue={themeTypes?.account![0].locales}
                    render={({ value, onChange }) => (
                      <Select
                        toggleId="kc-l-supported-locales"
                        onToggle={() => {
                          setSupportedLocalesOpen(!supportedLocalesOpen);
                        }}
                        onSelect={(_, v) => {
                          const option = v as string;
                          if (!value) {
                            onChange([option]);
                          } else if (value!.includes(option)) {
                            onChange(
                              value.filter((item: string) => item !== option)
                            );
                          } else {
                            onChange([...value, option]);
                          }
                        }}
                        onClear={() => {
                          onChange([]);
                        }}
                        selections={value}
                        variant={SelectVariant.typeaheadMulti}
                        aria-label={t("supportedLocales")}
                        isOpen={supportedLocalesOpen}
                        placeholderText={"Select locales"}
                      >
                        {themeTypes?.login![0].locales.map(
                          (locale: string, idx: number) => (
                            <SelectOption
                              selected={true}
                              key={`locale-${idx}`}
                              value={locale}
                            >
                              {t(`allSupportedLocales.${locale}`)}
                            </SelectOption>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormGroup>
                <FormGroup
                  label={t("defaultLocale")}
                  fieldId="kc-l-default-locale"
                >
                  <Controller
                    name="defaultLocale"
                    control={control}
                    defaultValue={realm?.defaultLocale}
                    render={({ onChange, value }) => (
                      <Select
                        toggleId="kc-default-locale"
                        onToggle={() =>
                          setDefaultLocaleOpen(!defaultLocaleOpen)
                        }
                        onSelect={(_, value) => {
                          onChange(value as string);
                          setSelectedLocale(value as string);
                          setKey(new Date().getTime());
                          setDefaultLocaleOpen(false);
                        }}
                        selections={
                          realm?.defaultLocale &&
                          t(`allSupportedLocales.${value}`)
                        }
                        variant={SelectVariant.single}
                        aria-label={t("defaultLocale")}
                        isOpen={defaultLocaleOpen}
                        placeholderText="Select one"
                        data-testid="select-default-locale"
                      >
                        {watchSupportedLocales.map(
                          (locale: string, idx: number) => (
                            <SelectOption
                              key={`default-locale-${idx}`}
                              value={locale}
                            >
                              {t(`allSupportedLocales.${locale}`)}
                            </SelectOption>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormGroup>
              </>
            )}
            <ActionGroup>
              <Button
                variant="primary"
                type="submit"
                data-testid="themes-tab-save"
              >
                {t("common:save")}
              </Button>
              <Button variant="link" onClick={reset}>
                {t("common:revert")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormPanel>

        <FormPanel className="kc-login-screen" title="Edit message bundle">
          <TextContent className="messageBundleDescription">
            {t("messageBundleDescription")}
          </TextContent>
          <div className="tableBorder">
            <KeycloakDataTable
              key={key}
              loader={loader}
              ariaLabelKey="client-scopes:clientScopeList"
              searchPlaceholderKey=" "
              emptyState={
                <ListEmptyState
                  hasIcon={true}
                  icon={SearchIcon}
                  message={t("common:noSearchResults")}
                  instructions={t("common:noSearchResultsInstructions")}
                  onPrimaryAction={() => {}}
                />
              }
              canSelectAll
              columns={[
                {
                  name: "Key",
                  cellRenderer: (row) => row[0],
                },
                {
                  name: "Value",
                  cellRenderer: (row) => row[1],
                },
              ]}
            />
          </div>
        </FormPanel>
      </PageSection>
    </>
  );
};
