import type { UISchemaElement } from '@jsonforms/core';
import merge from 'lodash/merge.js';
import { defaultStyles } from './defaultStyles.js';
import { getContext, setContext } from 'svelte';

const createEmptyStyles = (): Styles => ({
  control: {},
  verticalLayout: {},
  horizontalLayout: {},
  group: {},
  arrayList: {},
  label: {},
  dialog: {},
});

export interface Styles {
  control: {
    root?: string;
    wrapper?: string;
    label?: string;
    description?: string;
    error?: string;
    input?: string;
    textarea?: string;
    select?: string;
    option?: string;
  };
  dialog: {
    root?: string;
    title?: string;
    body?: string;
    actions?: string;
    buttonPrimary?: string;
    buttonSecondary?: string;
  };
  verticalLayout: {
    root?: string;
    item?: string;
  };
  horizontalLayout: {
    root?: string;
    item?: string;
  };
  group: {
    root?: string;
    label?: string;
    item?: string;
  };
  arrayList: {
    root?: string;
    legend?: string;
    addButton?: string;
    label?: string;
    itemWrapper?: string;
    noData?: string;
    item?: string;
    itemToolbar?: string;
    itemLabel?: string;
    itemContent?: string;
    itemExpanded?: string;
    itemMoveUp?: string;
    itemMoveDown?: string;
    itemDelete?: string;
  };
  label: {
    root?: string;
  };
}

const stylesKey = {};
export function provideStyles(styles?: Styles) {
  setContext(stylesKey, styles);
}
export function injectStyles(): Styles {
  return getContext(stylesKey) ?? defaultStyles;
}

export const useStyles = (element?: UISchemaElement) => {
  const userStyles = injectStyles();
  if (!element?.options?.styles) {
    return userStyles;
  }
  const styles = createEmptyStyles();
  if (userStyles) {
    merge(styles, userStyles);
  } else {
    merge(styles, defaultStyles);
  }
  if (element?.options?.styles) {
    merge(styles, element.options.styles);
  }
  return styles;
};
