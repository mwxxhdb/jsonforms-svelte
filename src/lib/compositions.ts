import type { JsonFormsCellRendererRegistryEntry, JsonFormsRendererRegistryEntry, JsonSchema, UISchemaElement } from "@jsonforms/core"
import { useStyles } from "./renderers/styles.js";
import merge from 'lodash/merge.js';
import cloneDeep from 'lodash/cloneDeep.js';
import {
  composePaths,
  findUISchema,
  getFirstPrimitiveProp,
  hasEnableRule,
  hasShowRule,
  isEnabled,
  isVisible as isRendererVisible,
  Resolve,
} from '@jsonforms/core';
import type { JsonFormsContext } from "./context.js";
import { isAnyReadonly } from "./renderers/utils.js";


/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const useVanillaControl = <
  I extends { control: any; handleChange: any }
>(
  input: I,
  adaptTarget: (target: any) => any = (v) => v.value
) => {
  const appliedOptions = merge(
    {},
    cloneDeep(input.control.config),
    cloneDeep(input.control.uischema.options)
  );

  let isFocused = false;
  const onChange = (event: Event) => {
    input.handleChange(input.control.path, adaptTarget(event.target));
  };

  const { id, description, errors, label, visible, required } = input.control;
  const controlWrapper = { id, description, errors, label, visible, required };

  return {
    ...input,
    styles: useStyles(input.control.uischema),
    isFocused,
    appliedOptions,
    controlWrapper,
    onChange,
  };
};

/**
 * Adds styles and appliedOptions
 */
export const useVanillaLayout = <I extends { layout: any }>(input: I) => {
  const appliedOptions = merge(
    {},
    cloneDeep(input.layout.config),
    cloneDeep(input.layout.uischema.options)
  );
  return {
    ...input,
    styles: useStyles(input.layout.uischema),
    appliedOptions,
  };
};

/**
 * Adds styles and appliedOptions
 */
export const useVanillaLabel = <I extends { label: any }>(input: I) => {
  const appliedOptions = merge(
    {},
    cloneDeep(input.label.config),
    cloneDeep(input.label.uischema.options)
  );
  return {
    ...input,
    styles: useStyles(input.label.uischema),
    appliedOptions,
  };
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const useVanillaArrayControl = <I extends { control: any }>(
  input: I
) => {
  const appliedOptions = merge(
    {},
    cloneDeep(input.control.config),
    cloneDeep(input.control.uischema.options)
  );

  const childUiSchema = findUISchema(
    input.control.uischemas,
    input.control.schema,
    input.control.uischema.scope,
    input.control.path,
    undefined,
    input.control.uischema,
    input.control.rootSchema
  );

  const childLabelForIndex = (index: number) => {
    const childLabelProp =
      input.control.uischema.options?.childLabelProp ??
      getFirstPrimitiveProp(input.control.schema);
    if (!childLabelProp) {
      return `${index}`;
    }
    const labelValue = Resolve.data(
      input.control.data,
      composePaths(`${index}`, childLabelProp)
    );
    if (labelValue === undefined || labelValue === null || isNaN(labelValue)) {
      return '';
    }
    return `${labelValue}`;
  };
  return {
    ...input,
    styles: useStyles(input.control.uischema),
    appliedOptions,
    childUiSchema,
    childLabelForIndex,
  };
};


export type RendererProps<U = UISchemaElement> = {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled: boolean;
  visible?: boolean;
}

export function isVisible(props: RendererProps<UISchemaElement>, data: any, ajv: any): boolean {
  return props.visible === undefined || hasShowRule(props.uischema)
    ? isRendererVisible(props.uischema, data, props.path, ajv)
    : props.visible;
}

export function isDisabled(props: RendererProps<UISchemaElement>, data: any, jsonforms: JsonFormsContext) {
  if (jsonforms.readonly) return true;
  if (hasEnableRule(props.uischema) && !isEnabled(props.uischema, data, props.path, jsonforms.ajv)) return true;
  if (isAnyReadonly(props.uischema.options, jsonforms.config) === true) return true;
  //@ts-ignore
  if (props.schema.readOnly === true) return true;
  return !props.enabled;
}