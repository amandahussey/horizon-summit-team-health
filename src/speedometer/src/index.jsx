import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'olive-components/lib/icon';

import {
  BLACK,
  GREY,
  PURPLE,
  TRANSPARENT,
  WHITE,
} from '@apertures/shared/dist/utilities/colors';
import { useAnimate } from '@apertures/shared/dist/utilities/hooks';
import { themePropType } from '@apertures/shared/dist/utilities/themes';
import { abbreviateNumber } from '@apertures/shared/dist/utilities/utils';

import './speedometer.scss';

const BEST_EMOJI = '\u{1F973}'
const HAPPIEST_EMOJI = '\u{1F603}'
const HAPPY_EMOJI = '\u{1F60A}'
const SLIGHTLY_HAPPY_EMOJI = '\u{1F642}'
const SHRUG_EMOJI = '\u{1F937}'
const SAD_EMOJI = '\u{1F61E}'
const TERRIBLE_EMOJI = '\u{1F616}'
const WORST_EMOJI = '\u{1F621}'

const DEFAULT_SIZE = 400;
const DEFAULT_THEME = {
  background: TRANSPARENT,
  colors: [PURPLE.PRIMARY, GREY['700']],
  needle: GREY['200'],
  shadow: BLACK.PRIMARY,
  text: WHITE.PRIMARY,
};

function Speedometer({ size, theme, values }) {
  const [red = 0, yellow = 0, green = 0] = values;
  const totalResponses = red + yellow + green;
  // const average = totalResponses > 0 ? (0 * red + 0.5 * yellow + 1 * green) / totalResponses : 0;
  const average = 0.9;

  let emoji;
  if(average < 0.1) emoji = WORST_EMOJI;
  else if(average >= 0.1 && average < 0.2) emoji = TERRIBLE_EMOJI;
  else if(average >= .2 && average < .4) emoji = SAD_EMOJI;
  else if(average >= .4 && average < .65) emoji = SHRUG_EMOJI;
  else if(average >= .65 && average < .75) emoji = SLIGHTLY_HAPPY_EMOJI;
  else if(average >= .75 && average < .8) emoji = HAPPY_EMOJI;
  else if(average >= .8 && average < .9) emoji = HAPPIEST_EMOJI;
  else emoji = BEST_EMOJI;

  console.log(values, average)

  const labelSize = size * 0.05;
  const { background, colors, needle, shadow, text } = {
    ...DEFAULT_THEME,
    ...theme,
  };

  const [animatedAverage] = useAnimate(average)
  // range from 0 to 180
  const needleDeg = animatedAverage * 100 * 1.8;

  return (
    <div style={{ width: size, color: 'white' }}>
      <h3
        style={{ 
          display: 'flex',
          alignItems: 'center',
          marginLeft: -24,
          fontWeight: 'bold'
        }}
      ><Icon icon={Icon.ICON.MAXIMIZE} size={Icon.SIZE.LG} />
        <div style={{
          height: 6,
          width: 6,
          background: 'white',
          position: 'relative',
          right: 19,
          borderRadius: '50%'
        }}/>
        Team Mood
      </h3>
      <div
        className="speedometer"
        style={{
          background,
          color: text,
          height: size * 0.6,
          width: size,
          '--needle-color': needle,
          '--text-color': text,
        }}
      >
        <div className="speedometer-panel" style={{ height: size, width: size }}>
          <div className="graduation">
            <div className="graduation-dash q1" />
            <div className="graduation-dash" />
            <div className="graduation-dash q3" />
            <div
              className="graduation-fill"
              style={{
                background: `conic-gradient(red 30%, yellow 50%, green 70%)`,
                transform: `rotate(180deg)`,
              }}
            />
          </div>
          <div
            className="needle"
            style={{
              fontSize: labelSize,
              transform: `rotate(${needleDeg}deg)`,
            }}
          />
          <div className="central-text" style={{ background: shadow }}>
            <div style={{ fontSize: 60, position: 'relative', bottom: 15 }}>{emoji}</div>
          </div>
        </div>
      </div>
      <div 
        style={{ 
          textAlign: 'center',
          padding: 12,
          fontWeight: 'bold'
        }}
      >
        Total Responses: {totalResponses}
      </div>
      <div className="bottom-bracket"></div>
    </div>
  );
}

Speedometer.propTypes = {
  size: PropTypes.number,
  theme: themePropType,
  value: PropTypes.number.isRequired,
};

Speedometer.defaultProps = {
  size: DEFAULT_SIZE,
  theme: {},
};

export const id = '86bd8be1-c8f3-4ce5-b6e9-f9c237fdd46a';

export default Speedometer;
