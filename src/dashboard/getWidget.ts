import { mapValues } from 'lodash';
import * as widgets from './widgets';
import type { WidgetModule, WidgetType } from './types';

const makeWidget = (module: WidgetModule): WidgetType => {
  const { default: Widget, Preview, layout, params } = module;

  return Object.freeze({
    Widget,
    Preview,
    layout: layout ?? {},
    params: params ?? {},
  });
};

const widgetTypes: Record<string, WidgetType> = mapValues(
  widgets as Record<string, WidgetModule>,
  makeWidget
);
Object.freeze(widgetTypes);

export function getAllWidgets(): Record<string, WidgetType> {
  return widgetTypes;
}

/**
 * Checks if a widget type is a valid widget
 */
export function isValidWidget(widgetType: string) {
  return Object.prototype.hasOwnProperty.call(widgetTypes, widgetType);
}

/**
 * Get widget info for a widget type
 */
export default function getWidget(widgetType: string): WidgetType | null {
  return widgetTypes[widgetType] ?? null;
}
