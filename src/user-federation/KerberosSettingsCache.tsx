import {
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../components/help-enabler/HelpItem";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserFederationKerberosCacheRepresentation } from "./models/user-federation";

export const KerberosSettingsCache = () => {
  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;

  const [isCachePolicyDropdownOpen, setIsCachePolicyDropdownOpen] = useState(
    false
  );
  const [isEvictionHourDropdownOpen, setIsEvictionHourDropdownOpen] = useState(
    false
  );
  const [
    isEvictionMinuteDropdownOpen,
    setIsEvictionMinuteDropdownOpen,
  ] = useState(false);
  const [isEvictionDayDropdownOpen, setIsEvictionDayDropdownOpen] = useState(
    false
  );

  const { handleSubmit, control, register } = useForm<
    UserFederationKerberosCacheRepresentation
  >();
  const onSubmit = (data: UserFederationKerberosCacheRepresentation) => {
    console.log(data);
  };

  return (
    <>
      {/* Cache settings */}
      <Form isHorizontal onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label={t("cachePolicy")}
          labelIcon={
            <HelpItem
              helpText={helpText("cachePolicyHelp")}
              forLabel={t("cachePolicy")}
              forID="kc-cache-policy"
            />
          }
          fieldId="kc-cache-policy"
        >
          <Controller
            name="cachePolicy"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-cache-policy"
                required
                onToggle={() =>
                  setIsCachePolicyDropdownOpen(!isCachePolicyDropdownOpen)
                }
                isOpen={isCachePolicyDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsCachePolicyDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="Choose..." isPlaceholder />
                <SelectOption key={1} value="Default" />
                <SelectOption key={2} value="Something" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        {/* TODO: Field shows only if cache policy is EVICT_WEEKLY */}
        <FormGroup
          label={t("evictionDay")}
          labelIcon={
            <HelpItem
              helpText={helpText("evictionDayHelp")}
              forLabel={t("evictionDay")}
              forID="kc-eviction-day"
            />
          }
          fieldId="kc-eviction-day"
        >
          <Controller
            name="evictionDay"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-eviction-day"
                required
                onToggle={() =>
                  setIsEvictionDayDropdownOpen(!isEvictionDayDropdownOpen)
                }
                isOpen={isEvictionDayDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsEvictionDayDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="Choose..." isPlaceholder />
                <SelectOption key={1} value="Sunday" />
                <SelectOption key={2} value="Monday" />
                <SelectOption key={3} value="Tuesday" />
                <SelectOption key={4} value="Wednesday" />
                <SelectOption key={5} value="Thursday" />
                <SelectOption key={6} value="Friday" />
                <SelectOption key={7} value="Saturday" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        {/* TODO: Field shows only if cache policy is EVICT_WEEKLY or EVICT_DAILY */}
        <FormGroup
          label={t("evictionHour")}
          labelIcon={
            <HelpItem
              helpText={helpText("evictionHourHelp")}
              forLabel={t("evictionHour")}
              forID="kc-eviction-hour"
            />
          }
          fieldId="kc-eviction-hour"
        >
          <Controller
            name="evictionHour"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-eviction-hour"
                onToggle={() =>
                  setIsEvictionHourDropdownOpen(!isEvictionHourDropdownOpen)
                }
                isOpen={isEvictionHourDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsEvictionHourDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="Choose..." isPlaceholder />
                <SelectOption key={1} value="00" />
                <SelectOption key={2} value="01" />
                <SelectOption key={3} value="..." />
                <SelectOption key={4} value="23" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        {/* TODO: Field shows only if cache policy is EVICT_WEEKLY or EVICT_DAILY */}
        <FormGroup
          label={t("evictionMinute")}
          labelIcon={
            <HelpItem
              helpText={helpText("evictionMinuteHelp")}
              forLabel={t("evictionMinute")}
              forID="kc-eviction-minute"
            />
          }
          fieldId="kc-eviction-minute"
        >
          <Controller
            name="evictionMinute"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-eviction-minute"
                onToggle={() =>
                  setIsEvictionMinuteDropdownOpen(!isEvictionMinuteDropdownOpen)
                }
                isOpen={isEvictionMinuteDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsEvictionMinuteDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="Choose..." isPlaceholder />
                <SelectOption key={1} value="00" />
                <SelectOption key={2} value="01" />
                <SelectOption key={3} value="..." />
                <SelectOption key={4} value="59" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        {/* TODO: Field shows only if cache policy is MAX_LIFESPAN */}
        <FormGroup
          label={t("maxLifespan")}
          labelIcon={
            <HelpItem
              helpText={helpText("maxLifespanHelp")}
              forLabel={t("maxLifespan")}
              forID="kc-max-lifespan"
            />
          }
          fieldId="kc-max-lifespan"
        >
          <TextInput
            isRequired
            type="text"
            id="kc-max-lifespan"
            name="maxLifespan"
            ref={register}
          />
        </FormGroup>

        {/* Use this button to test for submit */}
        {/* <button type="submit">Test submit</button> */}
      </Form>
    </>
  );
};
