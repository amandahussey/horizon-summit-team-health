import DataLoader from '@apertures/loader';

const contract = {};
export const id = '34c8fef1-2bc2-4ac0-9ff3-dc0a0d96497c';

const defaultRequest = {
  endpoint: '',
};

// optional mapping function, return { data, isEmpty, [supplement] }
const mapper = (rawData) => {};

/* 
 * ARGUMENTS
 * contract: contracts aren't implemented yet, so you can leave this as an empty object
 * defaultRequest: an object that defines an endpoint for apertures-api
 * opts:
 *   env: the environment (used to direct api requests to apertures-api)
 *   getRawData: this argument can be one of two things
 *     1) An object that can be used to hit an apertures-api endpoint (which would override the defaultRequest)
 *     2) A function that will be called instead of the default apertures-api request
 *   handleErrorResponse: a function that will be called in the event of an error during the request
 *   trackLoader: a function that will be called when the api request is made
 * mapper: a function that takes in a response and maps it to a data object for use in an aperture
 *   default format is { data, isEmpty, supplement }
 */
export default class RedYellowGreenLoaderLoader extends DataLoader {
  constructor(opts) {
    // if mapper is not needed, remove from below
    super('RedYellowGreenLoader Loader', contract, defaultRequest, opts, mapper);
    // clean up ^^ this name if necessary
  }
}
