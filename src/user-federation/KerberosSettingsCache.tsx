import {
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
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
  const { handleSubmit, control } = useForm<
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
        <button type="submit">Test submit</button>
      </Form>
    </>
  );
};
