import React, { useEffect, useState } from "react";
import {
  ActionGroup,
  Button,
  FormGroup,
  Select,
  SelectOption,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, UseFormMethods } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { FormAccess } from "../components/form-access/FormAccess";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useRealm } from "../context/realm-context/RealmContext";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import { useErrorHandler } from "react-error-boundary";
import moment from "moment";

export type UserFormProps = {
  form: UseFormMethods<UserRepresentation>;
  save: (user: UserRepresentation) => void;
  editMode: boolean;
  timestamp?: number;
};

export const UserForm = ({
  form: {
    handleSubmit,
    register,
    errors,
    watch,
    control,
    setValue,
    reset,
  },
  save,
  editMode,
}: UserFormProps) => {
  const { t } = useTranslation("users");
  const { realm } = useRealm();

  const [
    isRequiredUserActionsDropdownOpen,
    setRequiredUserActionsDropdownOpen,
  ] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const history = useHistory();
  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const handleError = useErrorHandler();

  const watchUsernameInput = watch("username");
  const [ timestamp, setTimestamp ] = useState(null)

  const convertTimestamp = (timestamp: number) => {
    return moment(timestamp).format("MM/DD/YY hh:MM:ss A");
  };

  useEffect(() => {
    if (editMode) {
      return asyncStateFetch(
        () => adminClient.users.find({ username: id }),
        (user) => {
          setupForm(user[0]);
        },
        handleError
      );
    }
  }, []);

  const setupForm = (user: UserRepresentation) => {
    reset();
    Object.entries(user).map((entry) => {
      console.log(entry[0], entry[1]);
      if (entry[0] == "createdTimestamp") {
        setTimestamp(entry[1]);
        console.log(timestamp)
        setValue(entry[0], convertTimestamp(entry[1]));
      } else {
        setValue(entry[0], entry[1]);
      }
    });
  };

  const emailRegexPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const requiredUserActionsOptions = [
    <SelectOption key={0} value="Configure OTP">
      {t("configureOTP")}
    </SelectOption>,
    <SelectOption key={1} value="Update Password">
      {t("updatePassword")}
    </SelectOption>,
    <SelectOption key={2} value="Update Profile">
      {t("updateProfile")}
    </SelectOption>,
    <SelectOption key={3} value="Verify Email">
      {t("verifyEmail")}
    </SelectOption>,
    <SelectOption key={4} value="Update User Locale">
      {t("updateUserLocale")}
    </SelectOption>,
  ];

  const clearSelection = () => {
    setSelected([]);
    setRequiredUserActionsDropdownOpen(false);
  };

  return (
    <FormAccess
      isHorizontal
      onSubmit={handleSubmit(save)}
      role="manage-users"
      className="pf-u-mt-lg"
    >
      {editMode ? (
        <>
          <FormGroup
            label={t("id")}
            fieldId="kc-id"
            isRequired
            validated={errors.id ? "error" : "default"}
            helperTextInvalid={t("common:required")}
          >
            <TextInput
              ref={register({ required: !editMode })}
              type="text"
              id="kc-id"
              name="id"
              isReadOnly={editMode}
            />
          </FormGroup>
          <FormGroup
            label={t("createdAt")}
            fieldId="kc-created-at"
            isRequired
            validated={errors.createdTimestamp ? "error" : "default"}
            helperTextInvalid={t("common:required")}
          >
            <TextInput
              ref={register({ required: !editMode })}
              type="text"
              id="kc-created-at"
              name="createdTimestamp"
              isReadOnly={editMode}
            />
          </FormGroup>
        </>
      ) : (
        <FormGroup
          label={t("username")}
          fieldId="kc-username"
          isRequired
          validated={errors.username ? "error" : "default"}
          helperTextInvalid={t("common:required")}
        >
          <TextInput
            ref={register()}
            type="text"
            id="kc-username"
            name="username"
            isReadOnly={editMode}
          />
        </FormGroup>
      )}
      <FormGroup
        label={t("email")}
        fieldId="kc-description"
        validated={errors.email ? "error" : "default"}
        helperTextInvalid={t("users:emailInvalid")}
      >
        <TextInput
          ref={register({
            pattern: emailRegexPattern,
          })}
          type="email"
          id="kc-email"
          name="email"
          aria-label={t("emailInput")}
        />
      </FormGroup>
      <FormGroup
        label={t("emailVerified")}
        fieldId="kc-email-verified"
        helperTextInvalid={t("common:required")}
        labelIcon={
          <HelpItem
            helpText={t("emailVerifiedHelpText")}
            forLabel={t("emailVerified")}
            forID="email-verified"
          />
        }
      >
        <Controller
          name="emailVerified"
          defaultValue={false}
          control={control}
          render={({ onChange, value }) => (
            <Switch
              id={"kc-user-email-verified"}
              isDisabled={false}
              onChange={(value) => onChange([`${value}`])}
              isChecked={value[0] === "true"}
              label={t("common:on")}
              labelOff={t("common:off")}
            />
          )}
        ></Controller>
      </FormGroup>
      <FormGroup
        label={t("firstName")}
        fieldId="kc-firstname"
        validated={errors.firstName ? "error" : "default"}
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          ref={register()}
          type="text"
          id="kc-firstname"
          name="firstName"
        />
      </FormGroup>
      <FormGroup
        label={t("lastName")}
        fieldId="kc-name"
        validated={errors.lastName ? "error" : "default"}
      >
        <TextInput
          ref={register()}
          type="text"
          id="kc-lastname"
          name="lastName"
          aria-label={t("lastName")}
        />
      </FormGroup>
      <FormGroup
        label={t("common:enabled")}
        fieldId="kc-enabled"
        labelIcon={
          <HelpItem
            helpText={t("disabledHelpText")}
            forLabel={t("enabled")}
            forID="enabled-label"
          />
        }
      >
        <Controller
          name="enabled"
          defaultValue={false}
          control={control}
          render={({ onChange, value }) => (
            <Switch
              id={"kc-user-enabled"}
              isDisabled={false}
              onChange={(value) => onChange([`${value}`])}
              isChecked={value[0] === "true"}
              label={t("common:on")}
              labelOff={t("common:off")}
            />
          )}
        ></Controller>
      </FormGroup>
      <FormGroup
        label={t("requiredUserActions")}
        fieldId="kc-required-user-actions"
        validated={errors.requiredActions ? "error" : "default"}
        helperTextInvalid={t("common:required")}
        labelIcon={
          <HelpItem
            helpText={t("requiredUserActionsHelpText")}
            forLabel={t("requiredUserActions")}
            forID="required-user-actions-label"
          />
        }
      >
        <Controller
          name="requiredActions"
          defaultValue={["0"]}
          typeAheadAriaLabel="Select an action"
          control={control}
          render={() => (
            <Select
              placeholderText="Select action"
              toggleId="kc-required-user-actions"
              onToggle={() =>
                setRequiredUserActionsDropdownOpen(
                  !isRequiredUserActionsDropdownOpen
                )
              }
              isOpen={isRequiredUserActionsDropdownOpen}
              selections={selected}
              onSelect={(_, value) => {
                const option = value as string;
                if (selected.includes(option)) {
                  setSelected(selected.filter((item) => item !== option));
                } else {
                  setSelected([...selected, option]);
                }
              }}
              onClear={clearSelection}
              variant="typeaheadmulti"
            >
              {requiredUserActionsOptions}
            </Select>
          )}
        ></Controller>
      </FormGroup>
      <ActionGroup>
        <Button
          data-testid="create-user"
          isDisabled={!editMode && !watchUsernameInput}
          variant="primary"
          type="submit"
        >
          {!editMode ? t("common:Create") : t("common:Save")}
        </Button>
        <Button
          data-testid="cancel-create-user"
          onClick={() => history.push(`/${realm}/users`)}
          variant="link"
        >
          {t("common:cancel")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
