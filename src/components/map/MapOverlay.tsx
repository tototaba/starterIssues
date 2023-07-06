import React, { Fragment } from 'react';

// TODO: implement precise definition
interface Feature {
  [key: string]: any;
}

const MapOverlay = ({ features }: { features: Feature[] }) => {
  return (
    <div
      style={{
        display: features.length ? 'block' : 'none',
        width: '300px',
        height: '300px',
        background: 'white',
        overflow: 'hidden',
        borderRadius: 8,
        border: 'solid 2px #ccc',
        boxShadow: '0 0 4 0 #eee',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          alignContent: 'start',
          rowGap: 4,
          columnGap: 8,
          padding: '1rem',
          overflow: 'auto',
        }}
      >
        {features.map((feature, i) => (
          <>
            {Object.entries(feature)
              .filter(([key]) => !['geometry'].includes(key))
              .map(([key, value]) => (
                <Fragment key={key}>
                  <div style={{ color: '#999', fontWeight: 'bold' }}>
                    {key.toString().replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </div>

                  <div>
                    {value
                      ? typeof value === 'object'
                        ? JSON.stringify(value)
                        : value.toString()
                      : 'None'}
                  </div>
                </Fragment>
              ))}

            {i < features.length - 1 && (
              // Divider
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  background: '#ccc',
                  gridColumn: 'span 2',
                  margin: '.5rem 0',
                }}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default MapOverlay;
