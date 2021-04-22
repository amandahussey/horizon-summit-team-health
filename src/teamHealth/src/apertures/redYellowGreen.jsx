import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import Aperture, { ApertureDimensions } from '@apertures/shared/dist/components/aperture';

import { useDataLoaders } from '@apertures/shared/dist/utilities/hooks';
import { themePropType } from '@apertures/shared/dist/utilities/themes';
import { concatClasses } from '@apertures/shared/dist/utilities/utils';

// The redYellowGreenTheme object below was NOT automatically created,
// please follow this convention for adding a theme to this aperture collection.
import { redYellowGreenTheme } from '../constants';

import './redYellowGreen.scss';

export const description = 'Description for the RedYellowGreen Aperture';
export const dimensions = ApertureDimensions.ONE_BY_ONE;
export const id = '313ef6b4-36f4-4081-92ff-a560e1b0abc2';
export const title = 'redYellowGreen';

const buildDefaultLoaders = (env, handleErrorResponse, trackLoader) => ({
  /* [Visualization_id_goes_here]: () =>
    new DataLoaderGoesHere({ env, handleErrorResponse, trackLoader }), */
});

function RedYellowGreen({
  className,
  env,
  handleDataLoaderError,
  handleEmptyState,
  handleRef,
  hideEmptyState,
  loaders,
  orgId,
  theme,
  trackLoader,
}) {
  const apertureRef = useRef(null);

  const defaultLoaders = useMemo(
    () => buildDefaultLoaders(env, handleDataLoaderError, trackLoader),
    [env, handleDataLoaderError, trackLoader]
  );

  const params = useMemo(
    () => ({
      orgId,
    }),
    [orgId]
  );

  const [data, lastUpdated, loading] = useDataLoaders(
    loaders,
    defaultLoaders,
    params
  );

  // access data like this: data[visualizationId]

  // use this variable to determine whether the aperture should display its empty state
  const empty = false; // check the data object

  useEffect(() => {
    if (handleEmptyState) {
      handleEmptyState(empty);
    }
  }, [empty, handleEmptyState]);

  useEffect(() => {
    if (handleRef) {
      handleRef(apertureRef);
    }
  }, [handleRef]);

  const { text } = {
    ...redYellowGreenTheme,
    ...theme,
  };

  const classes = concatClasses(['red-yellow-green-aperture', className]);

  return (
    <Aperture
      dimensions={dimensions}
      empty={empty && !hideEmptyState}
      loading={loading}
    >
      <div className={classes} ref={apertureRef} style={{ color: text }}>
        Aperture contents go here
      </div>
    </Aperture>
  );
}

// -------------------------------------
// GENERATED CODE, DO NOT EDIT OR DELETE
// -------------------------------------
RedYellowGreen.description = description;
RedYellowGreen.dimensions = dimensions;
RedYellowGreen.id = id;
RedYellowGreen.title = title;
// -------------------------------------

RedYellowGreen.propTypes = {
  className: PropTypes.string,
  env: PropTypes.string,
  handleDataLoaderError: PropTypes.func,
  handleEmptyState: PropTypes.func,
  handleRef: PropTypes.func,
  hideEmptyState: PropTypes.bool,
  loaders: PropTypes.objectOf(PropTypes.func),
  orgId: PropTypes.string.isRequired,
  theme: themePropType,
  trackLoader: PropTypes.func,
};

RedYellowGreen.defaultProps = {
  className: '',
  env: 'secure',
  handleDataLoaderError: null,
  handleEmptyState: null,
  handleRef: null,
  hideEmptyState: false,
  loaders: {},
  theme: {},
  trackLoader: null,
};

export default RedYellowGreen;
