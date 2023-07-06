import { Circle, RegularShape, Fill, Stroke, Style } from 'ol/style';

const shapeStyles: {
  [key: string]: (opts: { fill: Fill; stroke: Stroke }) => Style;
} = {
  Line: ({ stroke }) => new Style({ stroke, zIndex: 0 }),
  X: ({ fill, stroke }) =>
    new Style({
      image: new RegularShape({
        fill,
        stroke,
        points: 4,
        radius: 10,
        radius2: 0,
        angle: Math.PI / 4,
      }),
      zIndex: 2,
    }),
  Circle: ({ fill, stroke }) =>
    new Style({
      image: new Circle({
        radius: 10,
        fill,
        stroke,
      }),
      zIndex: 1,
    }),
  Rectangle: ({ fill, stroke }) =>
    new Style({
      image: new RegularShape({
        fill,
        stroke,
        radius: 15 / Math.SQRT2,
        radius2: 15,
        points: 4,
        angle: 0,
        scale: [1, 0.5],
      }),
      zIndex: 1,
    }),
  Square: ({ fill, stroke }) =>
    new Style({
      image: new RegularShape({
        fill,
        stroke,
        points: 4,
        radius: 10,
        angle: Math.PI / 4,
      }),
      zIndex: 1,
    }),
  Triangle: ({ fill, stroke }) =>
    new Style({
      image: new RegularShape({
        fill,
        stroke,
        points: 3,
        radius: 10,
        rotation: Math.PI / 4,
        angle: 0,
      }),
      zIndex: 1,
    }),
};

export const generateStyles = (symbology: any[]) => {
  const styles: { [key: string]: Style } = {
    'Type-LineString': new Style({
      stroke: new Stroke({
        width: 2.0,
        color: 'rgba(0, 0, 0, 0.90)',
      }),
      zIndex: 0,
    }),
    // TODO: Create a better placeholder (question mark, etc.)
    Unknown: new Style(),
  };

  symbology.forEach(
    ({ featureSubClass, style: { symbol, fillColor, stroke } }: any) => {
      styles['SubClass-' + featureSubClass] = shapeStyles[symbol]({
        fill: new Fill({
          color: fillColor,
        }),
        stroke: new Stroke({
          color: stroke.strokeColor,
          width: stroke.strokeWidth,
        }),
      });
    }
  );

  return styles;
};
