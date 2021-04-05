import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  PageSection,
} from "@patternfly/react-core";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { cellWidth } from "@patternfly/react-table";
import { useErrorHandler } from "react-error-boundary";
import _ from "lodash";
// import { JoinGroupDialog } from "./JoinGroupDialog";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
// import { MoveGroupDialog } from "../groups/MoveGroupDialog";
import { getLastId } from "../groups/groupIdUtils";
import { JoinGroupDialog } from "./JoinGroupDialog";

type GroupTableData = GroupRepresentation & {
  membersLength?: number;
};

export type UserFormProps = {
  username?: string;
  loader?: (
    first?: number,
    max?: number,
    search?: string
  ) => Promise<UserRepresentation[]>;
  addGroups?: (newReps: GroupRepresentation[]) => void;
};

export const UserGroups = () => {
  const { t } = useTranslation("roles");
  const { addAlert } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const handleError = useErrorHandler();

  const [selectedGroup, setSelectedGroup] = useState<GroupRepresentation>();
  const [listGroups, setListGroups] = useState(true);
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const [join, setJoin] = useState<GroupTableData>();

  const lastId = getLastId(location.pathname);


  const [isDirectMembership, setDirectMembership] = useState(true);
  const [open, setOpen] = useState(false);
  const [move, setMove] = useState<GroupTableData>();

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const alphabetize = (groupsList: GroupRepresentation[]) => {
    return _.sortBy(groupsList, (group) => group.path?.toUpperCase());
  };

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };

    const user = await adminClient.users.findOne({ id });
    setUsername(user.username!);

    const searchParam = search || "";
    if (searchParam) {
      params.search = searchParam;
      setSearch(searchParam);
    }

    if (!searchParam && !listGroups) {
      return [];
    }

    const joinedGroups = await adminClient.users.listGroups({ ...params, id });

    const allCreatedGroups = await adminClient.groups.find();

    const getAllPaths = joinedGroups.reduce(
      (acc: string[], cur) => (cur.path && acc.push(cur.path), acc),
      []
    );
    const parentGroupNames: string[] = [];
    const allGroupMembership: string[] = [];
    const slicedGroups: string[] = [];
    const rootLevelGroups: GroupRepresentation[] = [...allCreatedGroups];
    let allPaths: GroupRepresentation[] = [];

    const getAllSubgroupPaths = (
      o: any,
      f: any,
      context: GroupRepresentation[]
    ): GroupRepresentation[] => {
      f(o, context);
      if (typeof o !== "object") return context;
      if (Array.isArray(o))
        return o.forEach((e) => getAllSubgroupPaths(e, f, context)), context;
      for (const prop in o) getAllSubgroupPaths(o[prop], f, context);
      return context;
    };

    const arr = getAllSubgroupPaths(
      rootLevelGroups,
      (x: GroupRepresentation, context: GroupRepresentation[][]) => {
        if (x !== undefined && x.subGroups) context.push(x.subGroups);
      },
      []
    );

    const allSubgroups: GroupRepresentation[] = [].concat(...(arr as any));

    allPaths = [...rootLevelGroups, ...allSubgroups];

    getAllPaths.forEach((item) => {
      const paths = item.split("/");
      const groups: string[] = [];

      paths.reduce((acc, value) => {
        const path = acc + "/" + value;
        groups.push(path);
        return path;
      }, "");

      for (let i = 1; i < groups.length; i++) {
        slicedGroups.push(groups[i].substring(1));
      }
    });

    allGroupMembership.push(...slicedGroups);

    allPaths.forEach((item) => {
      if (item.subGroups!.length !== 0) {
        allPaths.push(...item!.subGroups!);
      }
    });

    allPaths = allPaths.filter((group) =>
      allGroupMembership.includes(group.path as any)
    );

    const topLevelGroups = allCreatedGroups.filter((value) =>
      parentGroupNames.includes(value.name!)
    );

    const subgroupArray: any[] = [];

    topLevelGroups.forEach((group) => subgroupArray.push(group.subGroups));

    const directMembership = joinedGroups.filter(
      (value) => !topLevelGroups.includes(value)
    );

    const filterDupesfromGroups = allPaths.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t.name === thing.name)
    );

    if (isDirectMembership) {
      return alphabetize(directMembership);
    }

    return alphabetize(filterDupesfromGroups);
  };

  useEffect(() => {
    return asyncStateFetch(
      () => {
        return Promise.resolve(adminClient.users.listGroups({ id }));
      },
      (response) => {
        setListGroups(!!(response && response.length > 0));
      },
      handleError
    );
  });

  useEffect(() => {
    refresh();
  }, [isDirectMembership]);

  const AliasRenderer = (group: GroupRepresentation) => {
    return <>{group.name}</>;
  };

  const LeaveButtonRenderer = (group: GroupRepresentation) => {
    return (
      <>
        <Button onClick={() => leave(group)} variant="link">
          {t("users:Leave")}
        </Button>
      </>
    );
  };

  const JoinGroupButtonRenderer = (group: GroupRepresentation) => {
    return (
      <>
        <Button onClick={() => joinGroup(group)} variant="link">
          {t("users:joinGroup")}
        </Button>
      </>
    );
  };

  const toggleModal = () => {
    setOpen(!open);
    // setJoin(group);
  }

  console.log(open)

  const joinGroup = (group: GroupRepresentation) => {
    setSelectedGroup(group);
    toggleModal();
  }

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("users:leaveGroup", {
      name: selectedGroup?.name,
    }),
    messageKey: t("users:leaveGroupConfirmDialog", {
      groupname: selectedGroup?.name,
      username: username,
    }),
    continueButtonLabel: "users:leave",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.users.delFromGroup({
          id,
          groupId: selectedGroup!.id!,
        });
        refresh();
        addAlert(t("users:removedGroupMembership"), AlertVariant.success);
      } catch (error) {
        addAlert(
          t("users:removedGroupMembershipError", { error }),
          AlertVariant.danger
        );
      }
    },
  });

  const leave = (group: GroupRepresentation) => {
    setSelectedGroup(group);
    toggleDeleteDialog();
  };

  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        {open &&
        <JoinGroupDialog
          // group={move!}
          open={open}
          onClose={() => setOpen(!open)}
          onConfirm={() => {}}
          username=""
          // onClose={() => setMove(undefined)}
          // onMove={async (id) => {
          //   delete move!.membersLength;
          //   try {
          //     try {
          //       await adminClient.groups.setOrCreateChild({ id: lastId! }, move!);
          //     } catch (error) {
          //       if (error.response) {
          //         throw error;
          //       }
          //     }
          //     setMove(undefined);
          //     refresh();
          //     addAlert(t("moveGroupSuccess"), AlertVariant.success);
          //   } catch (error) {
          //     addAlert(
          //       t("moveGroupError", {
          //         error: error.response?.data?.errorMessage || error,
          //       }),
          //       AlertVariant.danger
          //     );
          //   }
          // }}
        />}
        <KeycloakDataTable
          key={key}
          loader={loader}
          isPaginated
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="groups:searchGroup"
          canSelectAll
          onSelect={() => {}}
          toolbarItem={
            <>
              <Button
                className="kc-join-group-button"
                key="join-group-button"
                onClick={toggleModal}
                data-testid="add-group-button"
              >
                {t("users:joinGroup")}
              </Button>
              {JoinGroupButtonRenderer}
              <Checkbox
                label={t("users:directMembership")}
                key="direct-membership-check"
                id="kc-direct-membership-checkbox"
                onChange={() => setDirectMembership(!isDirectMembership)}
                isChecked={isDirectMembership}
              />
            </>
          }
          columns={[
            {
              name: "groupMembership",
              displayKey: "users:groupMembership",
              cellRenderer: AliasRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(40)],
            },
            {
              name: "path",
              displayKey: "users:Path",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(45)],
            },
            {
              name: "",
              cellRenderer: LeaveButtonRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
          ]}
          emptyState={
            !search ? (
              <ListEmptyState
                hasIcon={true}
                message={t("users:noGroups")}
                instructions={t("users:noGroupsText")}
                primaryActionText={t("users:joinGroup")}
                onPrimaryAction={() => {}}
              />
            ) : (
              ""
            )
          }
        />
      </PageSection>
    </>
  );
};
