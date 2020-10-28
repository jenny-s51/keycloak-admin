import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PageSection } from "@patternfly/react-core";

import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { RoleRepresentation } from "../model/role-model";
import { RolesList } from "./RoleList";
import { RealmContext } from "../context/realm-context/RealmContext";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { PaginatingTableToolbar } from "../components/table-toolbar/PaginatingTableToolbar";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";

export const RealmRolesSection = () => {
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const { t } = useTranslation("roles");
  const history = useHistory();
  const httpClient = useContext(HttpClientContext)!;
  const [roles, setRoles] = useState<RoleRepresentation[]>();
  const [filteredData, setFilteredData] = useState<RoleRepresentation[]>();
  const { realm } = useContext(RealmContext);

  const loader = async () => {
    const params: { [name: string]: string | number } = { first, max };
    if (filteredData) {
      return filteredData;
    }

    const result = await httpClient.doGet<RoleRepresentation[]>(
      `/admin/realms/${realm}/roles`,
      { params: params }
    );
    setRoles(result.data);
  };

  useEffect(() => {
    (async () => {
      if (filteredData) {
        return filteredData;
      }
      const result = await httpClient.doGet<RoleRepresentation[]>(
        `/admin/realms/${realm}/roles`
      );
      setRoles(result.data!);
    })();
  }, [first, max]);

  const filterData = (search: string) => {
    setFilteredData(
      roles!.filter((role) =>
        role.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <>
      <ViewHeader titleKey="roles:title" subKey="roles:roleExplain" />
      <PageSection variant="light">
        {roles && roles.length > 0 ? (
          <PaginatingTableToolbar
            inputGroupOnChange={filterData}
            inputGroupName="rolesToolbarTextInput"
            inputGroupPlaceholder={t("Search for role")}
            count={roles!.length}
            first={first}
            max={max}
            onNextClick={setFirst}
            onPreviousClick={setFirst}
            onPerPageSelect={(first, max) => {
              setFirst(first);
              setMax(max);
            }}
            toolbarItem={
              <>
                <Button onClick={() => history.push("/add-role")}>
                  {t("createRole")}
                </Button>
              </>
            }
          >
            <RolesList roles={filteredData || roles} refresh={loader} />
          </PaginatingTableToolbar>
        ) : (
          <ListEmptyState
            hasIcon={true}
            message={t("noRolesInThisRealm")}
            instructions={t("noRolesInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            onPrimaryAction={() => history.push("/add-role")}
          />
        )}
      </PageSection>
    </>
  );
};
