import React from 'react';
import PropTypes from 'prop-types';
// import { themePropType } from '@apertures/shared/dist/utilities/themes';

function Stoplight({ theme, values }) {
  return <div>STOPLIGHT</div>;
}

Stoplight.propTypes = {
  // theme: themePropType,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Stoplight.defaultProps = {
  theme: {},
};

export const id = '2f241285-9b0f-4236-a129-1793f96fe9c9';

export default Stoplight;
