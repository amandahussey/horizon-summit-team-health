import React from 'react';
import PropTypes from 'prop-types';
import { themePropType } from '@apertures/shared/dist/utilities/themes';

function Stoplight({ theme, values = []}) {
  const [red = 0, yellow = 0, green = 0] = values;
  // console.log(red, yellow, green)

  return (
    <div>
      <div>Red: {red}</div>
      <div>Yellow: {yellow}</div>
      <div>Green: {green}</div>
    </div>
  );
}

Stoplight.propTypes = {
  theme: themePropType,
  // values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Stoplight.defaultProps = {
  theme: {},
};

export const id = '2f241285-9b0f-4236-a129-1793f96fe9c9';

export default Stoplight;
