<<<<<<< HEAD
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, ButtonVariant, PageSection } from "@patternfly/react-core";
import type { KeyMetadataRepresentation } from "keycloak-admin/lib/defs/keyMetadataRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import "./RealmSettingsSection.css";
import { cellWidth } from "@patternfly/react-table";

type KeyData = KeyMetadataRepresentation & {
  provider?: string;
  type?: string;
};

type KeysTabInnerProps = {
  keys: KeyData[];
};

export const KeysTabInner = ({ keys }: KeysTabInnerProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { url } = useRouteMatch();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const [publicKey, setPublicKey] = useState("");
  const [certificate, setCertificate] = useState("");

  const loader = async () => {
    return keys;
  };

=======
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Label,
  PageSection,
  ToolbarItem,
} from "@patternfly/react-core";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import KeysMetadataRepresentation, {
  KeyMetadataRepresentation,
} from "keycloak-admin/lib/defs/keyMetadataRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { useAdminClient } from "../context/auth/AdminClient";
import _ from "lodash";
import { useRealm } from "../context/realm-context/RealmContext";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import "./RealmSettingsSection.css";

type KeyData = KeyMetadataRepresentation & {
  provider?: string;
};

type KeysTabProps = {
  keys: KeyData[];
  // addComposites: (newReps: RoleRepresentation[]) => void;
  realmComponents: ComponentRepresentation[];
  // onRemove: (newReps: RoleRepresentation[]) => void;
  // client?: ClientRepresentation;
};

export const KeysTab = ({ keys, realmComponents }: KeysTabProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const { realm } = useRealm();

  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [isInheritedHidden, setIsInheritedHidden] = useState(false);
  const [allRoles, setAllRoles] = useState<RoleRepresentation[]>([]);
    const [allKeys, setAllKeys] = useState<KeyData[]>([]);

  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
      console.log("Testing 123")
    //   setAllKeys(keys);
      keys.map((key) => { 
        key.provider = realmComponents.find(
          (component) => component.id === key.providerId
        )?.name!;
      });
    //   console.log(x)
  })

  const loader = async () => {

    const keysMetaData = allKeys;
    
    console.log("keyz", allKeys);

    return keysMetaData.map((key) => { 
            key.provider = realmComponents.find(
              (component) => component.id === key.providerId
            )?.name!;
          });
  };

<<<<<<<< HEAD:src/realm-settings/KeysListTab.tsx
>>>>>>> wip providers table
  React.useEffect(() => {
    refresh();
  }, [keys]);

<<<<<<< HEAD
=======

>>>>>>> wip providers table
  const [togglePublicKeyDialog, PublicKeyDialog] = useConfirmDialog({
    titleKey: t("realm-settings:publicKeys").slice(0, -1),
    messageKey: publicKey,
    continueButtonLabel: "common:close",
    continueButtonVariant: ButtonVariant.primary,
    noCancelButton: true,
    onConfirm: async () => {},
  });

  const [toggleCertificateDialog, CertificateDialog] = useConfirmDialog({
    titleKey: t("realm-settings:certificate"),
    messageKey: certificate,
    continueButtonLabel: "common:close",
    continueButtonVariant: ButtonVariant.primary,
    noCancelButton: true,
    onConfirm: async () => {},
  });
<<<<<<< HEAD

  const goToCreate = () => history.push(`${url}/add-role`);

  const ProviderRenderer = ({ provider }: KeyData) => {
    return <>{provider}</>;
  };

  const ButtonRenderer = ({ type, publicKey, certificate }: KeyData) => {
    if (type === "EC") {
      return (
        <>
          <Button
            onClick={() => {
              togglePublicKeyDialog();
              setPublicKey(publicKey!);
            }}
            variant="secondary"
            id="kc-public-key"
          >
=======
========
    // let f = 
    // keys.map((key) => { 
    //     key.provider = realmComponents.find(
    //       (component) => component.id === key.providerId
    //     )?.name!;
    //   });

    //   console.log(typeof f)

  //   keys.forEach((item) => {
  //       if (item.name === "ecdsa-generated" )
  //       console.log(item.config!.ecdsaEllipticCurveKey[0].slice(-3))
  //     }
  //       )
  //   keys.config!.ecdsaEllipticCurveKey.slice(-2)

  const toggleModal = () => setOpen(!open);
>>>>>>>> wip providers table:src/realm-settings/KeysTab.tsx

  const goToCreate = () => history.push(`${url}/add-role`);

  //   keys?.forEach((item) => {

  //     let x = adminClient.components.findOne({id: item.providerId!}).then((res) => console.log(res.name))
  //     console.log("sadsa", x)
  //      })

  const ProviderRenderer = ({provider}: KeyData) => {
    //   let p = adminClient.components.findOne({id: item.providerId!}).then(res => {return <>{res.name}</>})
    //   console.log("o", p)
    //     })
    //     return <>{adminClient.components.findOne({id: item.providerId!}).then(res => {return <>{res.name}</>})}</>;
    return <>{provider}</>;

};

  const ButtonRenderer = ({ name }: ComponentRepresentation) => {
    if (name === "ecdsa-generated") {
      return (
        <>
          <Button variant="secondary" id="kc-public-key">
>>>>>>> wip providers table
            {t("realm-settings:publicKeys").slice(0, -1)}
          </Button>
        </>
      );
<<<<<<< HEAD
    } else if (type === "RSA") {
      return (
        <>
          <div className="button-wrapper">
            <Button
              onClick={() => {
                togglePublicKeyDialog();
                setPublicKey(publicKey!);
              }}
              variant="secondary"
              id="kc-rsa-public-key"
            >
              {t("realm-settings:publicKeys").slice(0, -1)}
            </Button>
            <Button
              onClick={() => {
                toggleCertificateDialog();
                setCertificate(certificate!);
              }}
              variant="secondary"
              id="kc-certificate"
            >
              {t("realm-settings:certificate")}
            </Button>
          </div>
=======
    } else if (name === "rsa-generated" || name === "fallback-RS256") {
      return (
        <>
          <Button variant="secondary" id="kc-rsa-public-key">
            {t("realm-settings:publicKeys").slice(0, -1)}
          </Button>
          <Button variant="secondary" id="kc-certificate">
            {t("realm-settings:certificate")}
          </Button>
>>>>>>> wip providers table
        </>
      );
    }
  };

  return (
    <>
      <PageSection variant="light" padding={{ default: "noPadding" }}>
<<<<<<< HEAD
        <PublicKeyDialog />
        <CertificateDialog />
        <KeycloakDataTable
          key={key}
          isNotCompact={true}
          loader={loader}
          ariaLabelKey="realm-settings:keysList"
          searchPlaceholderKey="realm-settings:searchKey"
          canSelectAll
=======
        <KeycloakDataTable
          key={key}
          loader={loader}
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="roles:searchFor"
          canSelectAll
          toolbarItem={
            <>
              <ToolbarItem>
                <Checkbox
                  label="Hide inherited roles"
                  key="associated-roles-check"
                  id="kc-hide-inherited-roles-checkbox"
                  onChange={() => setIsInheritedHidden(!isInheritedHidden)}
                  isChecked={isInheritedHidden}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  key="add-role-button"
                  onClick={() => toggleModal()}
                  data-testid="add-role-button"
                >
                  {t("addRole")}
                </Button>
              </ToolbarItem>
            </>
          }
>>>>>>> wip providers table
          columns={[
            {
              name: "algorithm",
              displayKey: "realm-settings:algorithm",
<<<<<<< HEAD
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(15)],
=======
              //   cellRenderer: AlgRenderer,
              cellFormatters: [emptyFormatter()],
>>>>>>> wip providers table
            },
            {
              name: "type",
              displayKey: "realm-settings:type",
<<<<<<< HEAD
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(10)],
=======
              //   cellRenderer: TypeRenderer,
              cellFormatters: [emptyFormatter()],
>>>>>>> wip providers table
            },
            {
              name: "kid",
              displayKey: "realm-settings:kid",
              cellFormatters: [emptyFormatter()],
            },
<<<<<<< HEAD
=======

>>>>>>> wip providers table
            {
              name: "provider",
              displayKey: "realm-settings:provider",
              cellRenderer: ProviderRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "publicKeys",
              displayKey: "realm-settings:publicKeys",
<<<<<<< HEAD
              cellRenderer: ButtonRenderer,
              cellFormatters: [],
=======
            //   cellRenderer: ButtonRenderer,
              cellFormatters: [emptyFormatter()],
>>>>>>> wip providers table
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("noRoles")}
              instructions={t("noRolesInstructions")}
              primaryActionText={t("createRole")}
              onPrimaryAction={goToCreate}
            />
          }
        />
      </PageSection>
    </>
  );
};
<<<<<<< HEAD
=======
<<<<<<<< HEAD:src/realm-settings/KeysListTab.tsx
>>>>>>> wip providers table

type KeysProps = {
  keys: KeyMetadataRepresentation[];
  realmComponents: ComponentRepresentation[];
};

<<<<<<< HEAD
export const KeysListTab = ({ keys, realmComponents, ...props }: KeysProps) => {
=======

export const KeysListTab = ({ keys, realmComponents, ...props }: KeysProps) => {
    console.log("components", realmComponents)
    console.log(realmComponents.forEach((component) => console.log(component.name)))

>>>>>>> wip providers table
  return (
    <KeysTabInner
      keys={keys?.map((key) => {
        const provider = realmComponents.find(
          (component: ComponentRepresentation) =>
            component.id === key.providerId
        );
        return { ...key, provider: provider?.name };
      })}
      {...props}
    />
  );
};
<<<<<<< HEAD
=======
========
>>>>>>>> wip providers table:src/realm-settings/KeysTab.tsx
>>>>>>> wip providers table
