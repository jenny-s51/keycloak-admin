import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Page,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { DataLoader } from "../components/data-loader/DataLoader";
import { TableToolbar } from "../components/table-toolbar/TableToolbar";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { RoleRepresentation } from "../model/role-model";
import { RolesList } from "../roles/RoleList";
import { NoRealmRolesPage } from "../roles/NoRealmRoles";

export const RealmRolesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [max, setMax] = useState(10);
  const [roles, setRoles] = useState([] as RoleRepresentation[]);
  const [first, setFirst] = useState(0);
  const httpClient = useContext(HttpClientContext)!;

  const loader = async () => {
    return await httpClient
      .doGet("/admin/realms/master/roles")
      .then((r) => r.data as RoleRepresentation[]);
  };

  useEffect(() => {
    loader().then((result) => {
      setRoles(result) !== undefined ? result : [];
    });
  }, []);

  return (
    // <DataLoader loader={loader}>
    //   {(roles) => (
        <Page>
          <>
            <PageSection
              className="rolesHeader"
              variant={PageSectionVariants.light}
            >
              <TextContent className="rolesDescription">
                <Text component="h1">Realm roles</Text>
                <Text component="p">
                  Realm-level roles are a global namespace to define your roles.
                </Text>
              </TextContent>
            </PageSection>
            <NoRealmRolesPage />
            {/* <PageSection>
              <TableToolbar
                count={roles!.length}
                first={first}
                max={max}
                onNextClick={setFirst}
                onPreviousClick={setFirst}
                onPerPageSelect={(f, m) => {
                  setFirst(f);
                  setMax(m);
                }}
                toolbarItem={
                  <>
                    <Button onClick={() => history.push("/add-role")}>
                      {t("Create role")}
                    </Button>
                  </>
                }
              >
                <RolesList roles={roles} />
              </TableToolbar>
            </PageSection> */}
          </>
        </Page>
      // )}
    // </DataLoader>
  );
};
