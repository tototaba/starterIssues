import { ComponentType } from 'react';

export interface LayoutDimensionRange {
  default: number;
  min: number;
  max: number;
}
export type LayoutDimension = number | LayoutDimensionRange;

export interface WidgetLayout {
  w?: LayoutDimension;
  h?: LayoutDimension;
}

export interface WidgetParam<T = unknown> {
  defaultValue: T;
}

export type WidgetParams = Record<string, WidgetParam>;

export interface WidgetModule {
  layout?: WidgetLayout;
  params?: WidgetParams;
  default: ComponentType;
  Preview?: ComponentType;
}

export interface WidgetType {
  layout: WidgetLayout;
  params: WidgetParams;
  Widget: ComponentType;
  Preview?: ComponentType;
}
