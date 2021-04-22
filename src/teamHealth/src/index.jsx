import { extractAperture } from '@apertures/shared/dist/utilities/tools';
// apertures imports
import RedYellowGreen from './apertures/redYellowGreen';

const def = {
  meta: {
    id: '7e3fe889-bd07-4ac0-a90b-bcb3b48ea451',
    name: 'TeamHealth Collection',
  },
  apertures: {
    // apertures definitions
    redYellowGreen: extractAperture(RedYellowGreen),
  },
};

export default def;
