import React from "react";
import {
  AlertVariant,
  PageSection,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { ViewHeader } from "../components/view-header/ViewHeader";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { UserForm } from "./UserForm";
import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient } from "../context/auth/AdminClient";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";

export const UsersTabs = () => {
  const { t } = useTranslation("roles");
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const history = useHistory();

  const adminClient = useAdminClient();
  const form = useForm<UserRepresentation>({ mode: "onChange" });
  const { id } = useParams<{ id: string }>();

  const save = async (user: UserRepresentation) => {
    try {
      if (id) {
        await adminClient.users.update({ id: user.id! }, user);
        addAlert(t("users:userSaved"), AlertVariant.success);
      } else {
        await adminClient.users.create(user);
        addAlert(t("users:userCreated"), AlertVariant.success);
        history.push(url.substr(0, url.lastIndexOf("/")));
      }
    } catch (error) {
      addAlert(
        t("users:userCreateError", {
          error: error.response.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };

  return (
    <>
      <ViewHeader
        titleKey={id! || t("users:createUser")}
        subKey=""
        dividerComponent="div"
      />
      <PageSection variant="light">
        {id && (
          <KeycloakTabs isBox>
            <Tab
              eventKey="details"
              title={<TabTitleText>{t("details")}</TabTitleText>}
            >
              <UserForm form={form} save={save} editMode={true} />
            </Tab>
          </KeycloakTabs>
        )}
        {!id && <UserForm form={form} save={save} editMode={false} />}
      </PageSection>
    </>
  );
};