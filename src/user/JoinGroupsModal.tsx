import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbHeading,
  BreadcrumbItem,
  Button,
  Divider,
  DrilldownMenu,
  // Dropdown,
  // DropdownItem,
  // DropdownToggle,
  Menu,
  MenuBreadcrumb,
  MenuContent,
  MenuItem,
  MenuList,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
// import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
// import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { CaretDownIcon, CodeBranchIcon, CubeIcon, FilterIcon, LayerGroupIcon, StorageDomainIcon } from "@patternfly/react-icons";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { getId, getLastId } from "../groups/groupIdUtils";
import { useSubGroups } from "../groups/SubGroupsContext";
import { useErrorHandler } from "react-error-boundary";
import _ from "lodash";
// import { AliasRendererComponent } from "../realm-roles/AliasRendererComponent";
// import { emptyFormatter } from "../util";
// import { start } from "@patternfly/react-core/dist/js/helpers/Popper/thirdparty/popper-core";
// import { AliasRendererComponent } from "./AliasRendererComponent";

export type JoinGroupsModalProps = {
  open: boolean;
  toggleDialog: () => void;
  username: string;
};

type GroupTableData = GroupRepresentation & {
  membersLength?: number;
};


const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return [
      {
        key: "",
        value: "",
      },
    ];
  }
  return Object.keys(attributes).map((key) => ({
    key: key,
    value: attributes[key],
  }));
};

export const JoinGroupsModal = (props: JoinGroupsModalProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const { subGroups, setSubGroups } = useSubGroups();

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("roles");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const errorHandler = useErrorHandler();

  const { id } = useParams<{ id: string }>();
  const groupId = getLastId(location.pathname);

  const [menuDrilledIn, setMenuDrilledIn] = useState<string[]>([]);
  const [drilldownPath, setDrilldownPath] = useState<string[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<JSX.Element>(undefined as any);
  const [menuHeights, setMenuHeights] = useState({});
  const [activeMenu, setActiveMenu] = useState('rootMenu');

  // this.state = {
  //   menuDrilledIn: [],
  //   drilldownPath: [],
  //   menuHeights: {},
  //   activeMenu: 'rootMenu',
  //   breadcrumb: undefined
  // };


  const alphabetize = (rolesList: RoleRepresentation[]) => {
    return rolesList.sort((r1, r2) => {
      const r1Name = r1.name?.toUpperCase();
      const r2Name = r2.name?.toUpperCase();
      if (r1Name! < r2Name!) {
        return -1;
      }
      if (r1Name! > r2Name!) {
        return 1;
      }

      return 0;
    });
  };

  // const loader = async () => {
  //   const allGroups = await adminClient.groups.find();

  //   return alphabetize(allGroups)
  // };

  const getMembers = async (id: string) => {
    const response = await adminClient.groups.listMembers({ id });
    return response ? response.length : 0;
  };

  const loader = async () => {
    console.log("id", id);
    const groupsData = 
    groupId ? (await adminClient.groups.findOne({ id: groupId! })).subGroups : await adminClient.groups.find();

    if (groupsData) {
      const memberPromises = groupsData.map((group) => getMembers(group.id!));
      const memberData = await Promise.all(memberPromises);
      return _.cloneDeep(groupsData).map((group: GroupTableData, i) => {
        group.membersLength = memberData[i];
        return group;
      });
    } else {
      // history.push(`/${realm}/groups`);
      console.log("beep boop")
    }

    return [];
  };


  const GroupLinkRenderer = (group: GroupTableData) => (
    <>
      <Link key={group.id} to={`${location.pathname}/${group.id}`}>
        {group.name}
      </Link>
    </>
  );

  useEffect(() => {
    refresh();
  }, [filterType]);

  const drillOut = (toMenuId: string, fromPathId: string, breadcrumb: any) => {
    const indexOfMenuId = menuDrilledIn.indexOf(toMenuId);
    const menuDrilledInSansLast = menuDrilledIn.slice(0, indexOfMenuId);
    const indexOfMenuIdPath = drilldownPath.indexOf(fromPathId);
    const pathSansLast = drilldownPath.slice(0, indexOfMenuIdPath);
      setMenuDrilledIn(menuDrilledInSansLast),
      setDrilldownPath(pathSansLast),
      setActiveMenu(toMenuId),
      breadcrumb
  };
  
  // const setHeight = (menuId, height) => {
  //   if (!menuHeights[menuId]) {
  //       setMenuHeights({
  //         ...menuHeights,
  //         [menuId]: height
  //       })
  //   }
  // };
  const drillIn = (fromMenuId: string, toMenuId: string, pathId: string) => {
      setMenuDrilledIn([...menuDrilledIn, fromMenuId]),
      setDrilldownPath([...drilldownPath, pathId]),
      setActiveMenu(toMenuId);
  };

    const startRolloutBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem component="button" onClick={() => drillOut('rootMenu', 'group:start_rollout', null)}>
        Root
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Start rollout</BreadcrumbHeading>
    </Breadcrumb>
  );

  const appGroupingBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem component="button" onClick={() => drillOut('rootMenu', 'group:start_rollout', null)}>
        Root
      </BreadcrumbItem>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('drilldownMenuStart', 'group:app_grouping_start', startRolloutBreadcrumb)}
      >
        Start rollout
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Application Grouping</BreadcrumbHeading>
  </Breadcrumb>
  );

  const labelsBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('rootMenu', 'group:start_rollout', null)}
      >
        Root
      </BreadcrumbItem>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('drilldownMenuStart', 'group:labels_start', startRolloutBreadcrumb)}
      >
        Start rollout
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Labels</BreadcrumbHeading>
    </Breadcrumb>
  );

  const pauseRolloutsBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('rootMenu', 'group:pause_rollout', null)}
      >
        Root
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Pause rollouts</BreadcrumbHeading>
    </Breadcrumb>
  );

  const pauseRolloutsAppGrpBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('rootMenu', 'group:pause_rollout', null)}
      >
        Root
      </BreadcrumbItem>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('drilldownMenuPause', 'group:app_grouping', pauseRolloutsBreadcrumb)}
      >
        Pause rollouts
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Application Grouping</BreadcrumbHeading>
    </Breadcrumb>
  );

  const pauseRolloutsLabelsBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('rootMenu', 'group:pause_rollout', null)}
      >
        Root
      </BreadcrumbItem>
      <BreadcrumbItem
        component="button"
        onClick={() => drillOut('drilldownMenuPause', 'group:labels', pauseRolloutsBreadcrumb )}
      >
        Pause rollouts
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Labels</BreadcrumbHeading>
    </Breadcrumb>
  );

  const addStorageBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem component="button" onClick={() => drillOut('rootMenu', 'group:storage', null)}>
        Root
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">Add storage</BreadcrumbHeading>
    </Breadcrumb>
  )


  useEffect(
    () =>
      asyncStateFetch(
        async () => {
          const ids = getId(location.pathname);
          const isNavigationStateInValid =
            ids && ids.length !== subGroups.length + 1;
          if (isNavigationStateInValid) {
            const groups: GroupRepresentation[] = [];
            for (const i of ids!) {
              const group = await adminClient.groups.findOne({ id: i });
              if (group) groups.push(group);
            }
            return groups;
          } else {
            if (id) {
              const group = await adminClient.groups.findOne({ id: id });
              if (group) {
                return [...subGroups, group];
              } else {
                return subGroups;
              }
            } else {
              return subGroups;
            }
          }
        },
        (groups: GroupRepresentation[]) => setSubGroups(groups),
        errorHandler
      ),
    [id]
  );

  return (
    <Modal
      title={t("users:joinGroups", { name })}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
          key="add"
          data-testid="add-associated-roles-button"
          variant="primary"
          isDisabled={!selectedRows?.length}
          onClick={() => {
            props.toggleDialog();
            // props.onConfirm(selectedRows);
          }}
        >
          {t("common:add")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            props.toggleDialog();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
             <Menu
        id="rootMenu"
        containsDrilldown
        drilldownItemPath={drilldownPath}
        drilledInMenus={menuDrilledIn}
        onDrillIn={drillIn}
        onDrillOut={drillOut}
        onGetMenuHeight={setHeight}
      >
       {breadcrumb && 
          <>
            <MenuBreadcrumb>
              {breadcrumb}
            </MenuBreadcrumb>
            <Divider component="li" />
          </>
        }
        <MenuContent
        //  menuHeight={`${menuHeights[activeMenu]}px`}
         >
          <MenuList>
            <MenuItem
              itemId="group:start_rollout"
              direction="down"
              onClick={() => setBreadcrumb(startRolloutBreadcrumb)}
              drilldownMenu={
                <DrilldownMenu id="drilldownMenuStart">
                  <MenuItem
                    itemId="group:app_grouping_start"
                    description="Groups A-C"
                    direction="down"
                    onClick={() => setBreadcrumb(appGroupingBreadcrumb)}
                    drilldownMenu={
                      <DrilldownMenu id="drilldownMenuStartGrouping">
                        <MenuItem itemId="group_a">Group A</MenuItem>
                        <MenuItem itemId="group_b">Group B</MenuItem>
                        <MenuItem itemId="group_c">Group C</MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Application Grouping
                  </MenuItem>
                  <MenuItem itemId="count">Count</MenuItem>
                  <MenuItem
                    itemId="group:labels_start"
                    direction="down"
                    onClick={() => setBreadcrumb(labelsBreadcrumb)}
                    drilldownMenu={
                      <DrilldownMenu id="drilldownMenuStartLabels">
                        <MenuItem itemId="label_1">Label 1</MenuItem>
                        <MenuItem itemId="label_2">Label 2</MenuItem>
                        <MenuItem itemId="label_3">Label 3</MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Labels
                  </MenuItem>
                  <MenuItem itemId="annotations">Annotations</MenuItem>
                </DrilldownMenu>
              }
            >
              Start rollout
            </MenuItem>
            <MenuItem
              itemId="group:pause_rollout"
              direction="down"
              onClick={() => setBreadcrumb(pauseRolloutsBreadcrumb)}
              drilldownMenu={
                <DrilldownMenu id="drilldownMenuPause">
                  <MenuItem
                    itemId="group:app_grouping"
                    description="Groups A-C"
                    direction="down"
                    onClick={() => setBreadcrumb(pauseRolloutsAppGrpBreadcrumb)}
                    drilldownMenu={
                      <DrilldownMenu id="drilldownMenuGrouping">
                        <MenuItem itemId="group_a">Group A</MenuItem>
                        <MenuItem itemId="group_b">Group B</MenuItem>
                        <MenuItem itemId="group_c">Group C</MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Application Grouping
                  </MenuItem>
                  <MenuItem itemId="count">Count</MenuItem>
                  <MenuItem
                    itemId="group:labels"
                    direction="down"
                    onClick={() => setBreadcrumb(pauseRolloutsLabelsBreadcrumb)}
                    drilldownMenu={
                      <DrilldownMenu id="drilldownMenuLabels">
                        <MenuItem itemId="label_1">Label 1</MenuItem>
                        <MenuItem itemId="label_2">Label 2</MenuItem>
                        <MenuItem itemId="label_3">Label 3</MenuItem>
                      </DrilldownMenu>
                    }
                  >
                    Labels
                  </MenuItem>
                  <MenuItem itemId="annotations">Annotations</MenuItem>
                </DrilldownMenu>
              }
            >
              Pause rollouts
            </MenuItem>
            <MenuItem
              itemId="group:storage"
              icon={<StorageDomainIcon aria-hidden />}
              direction="down"
              onClick={() => setBreadcrumb(addStorageBreadcrumb)}
              drilldownMenu={
                <DrilldownMenu id="drilldownMenuStorage">
                  <MenuItem icon={<CodeBranchIcon aria-hidden />} itemId="git">
                    From Git
                  </MenuItem>
                  <MenuItem icon={<LayerGroupIcon aria-hidden />} itemId="container">
                    Container Image
                  </MenuItem>
                  <MenuItem icon={<CubeIcon aria-hidden />} itemId="docker">
                    Docker File
                  </MenuItem>
                </DrilldownMenu>
              }
            >
              Add storage
            </MenuItem>
            <MenuItem itemId="edit">Edit</MenuItem>
            <MenuItem itemId="delete_deployment">Delete deployment config</MenuItem>
          </MenuList>
        </MenuContent>
      </Menu>
      {/* <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="groups:Groups"
        searchPlaceholderKey="groups:searchGroups"
        canSelectAll
        isPaginated
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            cellRenderer: GroupLinkRenderer,
            cellFormatters: [emptyFormatter()]
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("groups:noGroupsInThisRealm")}
            instructions={t("groups:noGroupsInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            // onPrimaryAction={goToCreate}
          />
        }
      /> */}

    </Modal>
  );
};
