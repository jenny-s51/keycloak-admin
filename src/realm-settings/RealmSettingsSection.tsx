import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import {
  AlertVariant,
  ButtonVariant,
  DropdownItem,
  DropdownSeparator,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";

import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { toUpperCase } from "../util";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useAdminClient, asyncStateFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAlerts } from "../components/alert/Alerts";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { RealmSettingsLoginTab } from "./LoginTab";
import { RealmSettingsGeneralTab } from "./GeneralTab";
import { PartialImportDialog } from "./PartialImport";
import { RealmSettingsThemesTab } from "./ThemesTab";
import { RealmSettingsEmailTab } from "./EmailTab";
import { KeysListTab } from "./KeysListTab";
import { KeyMetadataRepresentation } from "keycloak-admin/lib/defs/keyMetadataRepresentation";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { KeysProviderTab } from "./KeysProvidersTab";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";

type RealmSettingsHeaderProps = {
  onChange: (value: boolean) => void;
  value: boolean;
  save: () => void;
  realmName: string;
};

const RealmSettingsHeader = ({
  save,
  onChange,
  value,
  realmName,
}: RealmSettingsHeaderProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const history = useHistory();
  const { refresh } = useRealm();
  const [partialImportOpen, setPartialImportOpen] = useState(false);

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "realm-settings:disableConfirmTitle",
    messageKey: "realm-settings:disableConfirm",
    continueButtonLabel: "common:disable",
    onConfirm: () => {
      onChange(!value);
      save();
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "realm-settings:deleteConfirmTitle",
    messageKey: "realm-settings:deleteConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.realms.del({ realm: realmName });
        addAlert(t("deletedSuccess"), AlertVariant.success);
        history.push("/master/");
        refresh();
      } catch (error) {
        addAlert(t("deleteError", { error }), AlertVariant.danger);
      }
    },
  });

  return (
    <>
      <DisableConfirm />
      <DeleteConfirm />
      <PartialImportDialog
        open={partialImportOpen}
        toggleDialog={() => setPartialImportOpen(!partialImportOpen)}
      />
      <ViewHeader
        titleKey={toUpperCase(realmName)}
        divider={false}
        dropdownItems={[
          <DropdownItem
            key="import"
            data-testid="openPartialImportModal"
            onClick={() => {
              setPartialImportOpen(true);
            }}
          >
            {t("partialImport")}
          </DropdownItem>,
          <DropdownItem key="export" onClick={() => {}}>
            {t("partialExport")}
          </DropdownItem>,
          <DropdownSeparator key="separator" />,
          <DropdownItem key="delete" onClick={toggleDeleteDialog}>
            {t("common:delete")}
          </DropdownItem>,
        ]}
        isEnabled={value}
        onToggle={(value) => {
          if (!value) {
            toggleDisableDialog();
          } else {
            onChange(value);
            save();
          }
        }}
      />
    </>
  );
};

export const RealmSettingsSection = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const handleError = useErrorHandler();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const form = useForm();
  const { control, getValues, setValue } = form;
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [activeTab2, setActiveTab2] = useState(0);
  const [keys, setKeys] = useState<KeyMetadataRepresentation[]>([]);
  const [realmComponents, setRealmComponents] = useState<
    ComponentRepresentation[]
  >([]);

  useEffect(() => {
    return asyncStateFetch(
      () => adminClient.realms.findOne({ realm: realmName }),
      (realm) => {
        setupForm(realm);
        setRealm(realm);
      },
      handleError
    );
  }, []);

  useEffect(() => {
    const update = async () => {
      const keysMetaData = await adminClient.realms.getKeys({
        realm: realmName,
      });
      setKeys(keysMetaData.keys!);
      const realmComponents = await adminClient.components.find({
        type: "org.keycloak.keys.KeyProvider",
        realm: realmName,
      });
      setRealmComponents(realmComponents);
    };
    setTimeout(update, 100);
  }, []);

  const setupForm = (realm: RealmRepresentation) => {
    Object.entries(realm).map((entry) => setValue(entry[0], entry[1]));
  };

  const save = async (realm: RealmRepresentation) => {
    try {
      await adminClient.realms.update({ realm: realmName }, realm);
      setRealm(realm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("saveError", { error }), AlertVariant.danger);
    }
  };

  return (
    <>
      <Controller
        name="enabled"
        control={control}
        defaultValue={true}
        render={({ onChange, value }) => (
          <RealmSettingsHeader
            value={value}
            onChange={onChange}
            realmName={realmName}
            save={() => save(getValues())}
          />
        )}
      />
      <PageSection variant="light" className="pf-u-p-0">
        <FormProvider {...form}>
          <KeycloakTabs isBox>
            <Tab
              eventKey="general"
              title={<TabTitleText>{t("realm-settings:general")}</TabTitleText>}
              data-testid="rs-general-tab"
            >
              <RealmSettingsGeneralTab
                save={save}
                reset={() => setupForm(realm!)}
              />
            </Tab>
            <Tab
              eventKey="login"
              title={<TabTitleText>{t("realm-settings:login")}</TabTitleText>}
              data-testid="rs-login-tab"
            >
              <RealmSettingsLoginTab save={save} realm={realm!} />
            </Tab>
            <Tab
              eventKey="email"
              title={<TabTitleText>{t("realm-settings:email")}</TabTitleText>}
              data-testid="rs-email-tab"
            >
              <RealmSettingsEmailTab
                save={save}
                reset={() => setupForm(realm!)}
              />
            </Tab>
            <Tab
              eventKey="themes"
              title={<TabTitleText>{t("realm-settings:themes")}</TabTitleText>}
              data-testid="rs-themes-tab"
            >
              <RealmSettingsThemesTab
                save={save}
                reset={() => setupForm(realm!)}
              />
            </Tab>
            <Tab
              eventKey="keys"
              title={<TabTitleText>{t("realm-settings:keys")}</TabTitleText>}
              data-testid="rs-keys-tab"
            >
              <Tabs
                activeKey={activeTab2}
                onSelect={(_, key) => setActiveTab2(key as number)}
              >
                <Tab
                  id="setup"
                  eventKey={0}
                  title={<TabTitleText>{t("keysList")}</TabTitleText>}
                >
                  <KeysListTab keys={keys} realmComponents={realmComponents} />
                </Tab>
              </Tabs>
            </Tab>
          </KeycloakTabs>
        </FormProvider>
      </PageSection>
    </>
  );
};
