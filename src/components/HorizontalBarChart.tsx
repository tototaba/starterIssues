import React, { useMemo } from 'react';
import { MuiVegaLite } from '@material-vega/material-ui';

interface HorizontalBarChartProps {
  values: { name: string; amount: number | undefined }[];
}

const HorizontalBarChart = ({ values }: HorizontalBarChartProps) => {
  const mappedValues = useMemo(() => {
    let maxValue = 0;

    for (const { amount } of values) {
      if (amount && amount > maxValue) maxValue = amount;
    }

    return values.map(({ name, amount }) => ({
      name,
      amount,
      // Note: This is a "dumb" way to check if the amount label will fit
      // inside of the bar in the chart (bar is at least 40% of max width).
      // It does not take into account text width but works up to roughly $1m.
      textFitsInside: amount && amount > maxValue * 0.4,
    }));
  }, [values]);

  return (
    <MuiVegaLite
      height={150}
      autoResize
      variant="verticalBarChart"
      spec={{
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        // width: 'container',
        data: { values: mappedValues },
        config: {
          text: { color: 'black' },
          bar: { fill: '#0F62FE' },
          view: { stroke: null },
        },
        layer: [
          {
            mark: { type: 'bar' },
            encoding: {
              y: {
                field: 'name',
                type: 'ordinal',
                axis: {
                  orient: 'left',
                  labelAlign: 'right',
                  title: '',
                  tickSize: 0,
                  domain: false,
                  grid: false,
                  ticks: false,
                },
                scale: { paddingInner: 0.3, paddingOuter: 0 },
              },
              x: {
                field: 'amount',
                type: 'quantitative',
                axis: {
                  labels: false,
                  title: '',
                  tickSize: 0,
                  domain: false,
                  grid: false,
                  ticks: false,
                },
              },
            },
          },
          {
            mark: {
              type: 'text',
              align: { expr: `datum.textFitsInside ? 'right' : 'left'` },
              dx: { expr: `datum.textFitsInside ? -5 : 5` },
            },
            encoding: {
              y: { field: 'name', type: 'ordinal' },
              x: { field: 'amount', type: 'quantitative' },
              text: { field: 'amount', type: 'quantitative', format: '$,.2f' },
              tooltip: {
                field: 'amount',
                type: 'quantitative',
                format: '$,.2f',
              },
              color: {
                value: { expr: `datum.textFitsInside ? 'white' : 'black'` },
              },
            },
          },
        ],
      }}
    />
  );
};

export default HorizontalBarChart;
