import {
  defaultMapStateToEnumCellProps,
  mapDispatchToArrayControlProps,
  mapDispatchToControlProps,
  mapDispatchToMultiEnumProps,
  mapStateToAllOfProps,
  mapStateToAnyOfProps,
  mapStateToArrayControlProps,
  mapStateToArrayLayoutProps,
  mapStateToCellProps,
  mapStateToControlProps,
  mapStateToControlWithDetailProps,
  mapStateToDispatchCellProps,
  mapStateToEnumControlProps,
  mapStateToJsonFormsRendererProps,
  mapStateToLabelProps,
  mapStateToLayoutProps,
  mapStateToMasterListItemProps,
  mapStateToMultiEnumControlProps,
  mapStateToOneOfEnumCellProps,
  mapStateToOneOfEnumControlProps,
  mapStateToOneOfProps,
  type ControlElement,
  type CoreActions,
  type Dispatch,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsRendererRegistryEntry,
  type JsonFormsState,
  type JsonSchema,
  type LabelElement,
  type Layout,
  type OwnPropsOfMasterListItem,
  type StatePropsOfJsonFormsRenderer,
  type UISchemaElement,
  type JsonFormsSubStates
} from '@jsonforms/core';
import { injectDispatch, injectJsonforms } from './context.js';

export interface RendererProps<U = UISchemaElement> {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  config?: any;
}

export interface ControlProps extends RendererProps {
  uischema: ControlElement;
}

export function useControl<R, D, P extends {}>(props: P, jsonforms: JsonFormsSubStates, dispatch: Dispatch<CoreActions>, stateMap: (state: JsonFormsState, props: P) => R): { control: Required<R> };
export function useControl<R, D, P extends {}>(props: P, jsonforms: JsonFormsSubStates, dispatch: Dispatch<CoreActions>, stateMap: (state: JsonFormsState, props: P) => R, dispatchMap: (dispatch: Dispatch<CoreActions>) => D): { control: Required<R> } & D;
export function useControl<R, D, P extends {}>(props: P, jsonforms: JsonFormsSubStates, dispatch: Dispatch<CoreActions>, stateMap: (state: JsonFormsState, props: P) => R, dispatchMap?: (dispatch: Dispatch<CoreActions>) => D) {
  if (!jsonforms || !dispatch) {
    throw "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?";
  }

  let id: string | undefined = undefined;
  const control = { ...props, ...stateMap({ jsonforms }, props), id: id, };

  const dispatchMethods = dispatchMap?.(dispatch);

  return { control, ...dispatchMethods };
}

/**
 * Provides generic bindings for 'Control' elements.
 * Should be used when no specialized bindings are appropriate.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsControl = (props: ControlProps, jsonforms: JsonFormsSubStates, dispatch: Dispatch<CoreActions>) => {
  return useControl(props, jsonforms, dispatch, mapStateToControlProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which can provide a 'detail',
 * for example array and object renderers.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsControlWithDetail = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToControlWithDetailProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'enum' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToEnumControlProps,
    mapDispatchToControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to manually constructed
 * 'oneOf' enums. These are used to enhance enums with label support.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToOneOfEnumControlProps,
    mapDispatchToControlProps
  );
};

// Explicitly create type to avoid TS2732.
// This is due to core's StatePropsOfArrayControl exposing AJV's ErrorObject type.
// The same as the parameterized return type of useControl
// Could alternatively be created like the following with Typescript 4.7+
// but this does not work with the ESLint typescript parser, yet:
// type UseJsonFormsArrayControlReturnType = typeof useControl<
//   ReturnType<typeof mapStateToArrayControlProps>,
//   ReturnType<typeof mapDispatchToArrayControlProps>,
//   ControlProps
// >;
type UseJsonFormsArrayControlReturnType = {
  control: Required<ReturnType<typeof mapStateToArrayControlProps>>
} & ReturnType<typeof mapDispatchToArrayControlProps>;
/**
 * Provides bindings for 'Control' elements which resolve to 'array' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsArrayControl: (
  props: ControlProps
) => UseJsonFormsArrayControlReturnType = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToArrayControlProps,
    mapDispatchToArrayControlProps
  );
};

/**
 * Provides bindings for 'Control' elements which resolve to 'allOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsAllOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToAllOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to 'anyOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsAnyOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToAnyOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to 'oneOf' schema elements.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfControl = (props: ControlProps) => {
  return useControl(props, mapStateToOneOfProps, mapDispatchToControlProps);
};

/**
 * Provides bindings for 'Control' elements which resolve to multiple choice enums.
 *
 * Access bindings via the provided reactive `control` object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsMultiEnumControl = (props: ControlProps) => {
  return useControl(
    props,
    mapStateToMultiEnumControlProps,
    mapDispatchToMultiEnumProps
  );
};

export interface LayoutProps extends RendererProps {
  uischema: Layout;
}

/**
 * Provides bindings for 'Layout' elements, e.g. VerticalLayout, HorizontalLayout, Group.
 *
 * Access bindings via the provided reactive 'layout' object.
 */
export const useJsonFormsLayout = (props: LayoutProps) => {
  const { control, ...other } = useControl(props, mapStateToLayoutProps);
  return { layout: control, ...other };
};

/**
 * Provides bindings for 'Control' elements which resolve to 'array' elements which
 * shall be rendered as a layout instead of a control.
 *
 * Access bindings via the provided reactive 'layout' object.
 */
export const useJsonFormsArrayLayout = (props: ControlProps) => {
  const { control, ...other } = useControl(props, mapStateToArrayLayoutProps);
  return { layout: control, ...other };
};

/**
 * Provides bindings for list elements of a master-list-detail control setup.
 * The element using this binding is not supposed to be registered as an own renderer
 * but used in a more specialized control.
 *
 * Access bindings via the provided reactive 'item' object.
 */
export const useJsonFormsMasterListItem = (props: OwnPropsOfMasterListItem) => {
  const { control, ...other } = useControl<
    Omit<OwnPropsOfMasterListItem, 'handleSelect' | 'removeItem'>,
    unknown,
    OwnPropsOfMasterListItem
  >(props, mapStateToMasterListItemProps);
  return { item: control, ...other };
};

/**
 * Provides specialized bindings which can be used for any renderer.
 * Useful for meta elements like dispatchers.
 *
 * Access bindings via the provided reactive 'renderer' object.
 */
export const useJsonFormsRenderer = (props: RendererProps) => {
  const jsonforms = injectJsonforms();
  const dispatch = injectDispatch();

  if (!jsonforms || !dispatch) {
    throw "'jsonforms' or 'dispatch' couldn't be injected. Are you within JSON Forms?";
  }

  const rawProps = mapStateToJsonFormsRendererProps(
    { jsonforms },
    props
  ) as Required<StatePropsOfJsonFormsRenderer>;

  const rootSchema = rawProps.rootSchema;
  const { rootSchema: _rootSchema, ...rest } = rawProps;
  const renderer = rest;

  return {
    renderer,
    rootSchema,
  };
};

/**
 * Provides bindings for 'Label' elements.
 *
 * Access bindings via the provided reactive `label` object.
 */
export const useJsonFormsLabel = (props: RendererProps<LabelElement>) => {
  const { control, ...other } = useControl(props, mapStateToLabelProps);
  return { label: control, ...other };
};

/**
 * Provides bindings for cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for enum cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    defaultMapStateToEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for 'oneOf' enum cell elements. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsOneOfEnumCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToOneOfEnumCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};

/**
 * Provides bindings for a cell dispatcher. Cells are meant to show simple inputs,
 * for example without error validation, within a larger structure like tables.
 *
 * Access bindings via the provided reactive 'cell' object.
 * Dispatch changes via the provided `handleChange` method.
 */
export const useJsonFormsDispatchCell = (props: ControlProps) => {
  const { control, ...other } = useControl(
    props,
    mapStateToDispatchCellProps,
    mapDispatchToControlProps
  );
  return { cell: control, ...other };
};
