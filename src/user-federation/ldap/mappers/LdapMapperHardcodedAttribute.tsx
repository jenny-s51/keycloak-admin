import { FormGroup, TextInput } from "@patternfly/react-core";
import React from "react";
import { HelpItem } from "../../../components/help-enabler/HelpItem";
import { UseFormMethods } from "react-hook-form";
import { FormAccess } from "../../../components/form-access/FormAccess";
import { useTranslation } from "react-i18next";
import { LdapMapperGeneral } from "./shared/LdapMapperGeneral";

export type LdapMapperHardcodedAttributeProps = {
  form: UseFormMethods;
};

export const LdapMapperHardcodedAttribute = ({
  form,
}: LdapMapperHardcodedAttributeProps) => {
  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;

  return (
    <>
      <FormAccess role="manage-realm" isHorizontal>
        <LdapMapperGeneral form={form} />
        <FormGroup
          label={t("userModelAttributeName")}
          labelIcon={
            <HelpItem
              helpText={helpText("userModelAttributeNameHelp")}
              forLabel={t("userModelAttributeName")}
              forID="kc-user-model-attribute"
            />
          }
          fieldId="kc-user-model-attribute"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-user-model-attribute"
            data-testid="user-model-attribute"
            name="config.user-model-attribute"
            ref={form.register}
          />
        </FormGroup>
        <FormGroup
          label={t("attributeValue")}
          labelIcon={
            <HelpItem
              helpText={helpText("attributeValueHelp")}
              forLabel={t("attributeValue")}
              forID="kc-attribute-value"
            />
          }
          fieldId="kc-attribute-value"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-attribute-value"
            data-testid="attribute-value"
            name="config.attribute-value"
            ref={form.register}
          />
        </FormGroup>
      </FormAccess>
    </>
  );
};
