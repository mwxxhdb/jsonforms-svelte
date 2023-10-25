import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import {
  Resolve,
  composePaths,
  findUISchema,
  getFirstPrimitiveProp,
  hasEnableRule,
  hasShowRule,
  isEnabled,
  isVisible as isRendererVisible,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep.js';
import merge from 'lodash/merge.js';
import type { JsonFormsContext } from "./context.js";
import { useStyles } from "./renderers/styles.js";
import { isAnyReadonly } from "./renderers/utils.js";


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