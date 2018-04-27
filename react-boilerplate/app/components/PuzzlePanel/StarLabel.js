/**
 *
 * StarLabel
 *
 */

/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

const PuzzleScore = styled.button`
  background-color: darkorchid;
  font-family: monaco;
  font-weight: bold;
  font-size: 0.9em;
  color: #fcf4dc;
  border: 2px solid darkorchid;
  border-radius: 10px;
  padding: 0 2px;
  margin-right: 6px;
  margin-bottom: 3px;
`;

function StarLabel(props) {
  const { starSet } = props;
  let starCount = 0;
  let starSum = 0;
  const starDict = [[], [], [], [], []];
  starSet.edges.forEach((edge) => {
    starCount += 1;
    starSum += edge.node.value;
    if (edge.node.value - 1 in starDict) {
      starDict[edge.node.value - 1] = starDict[edge.node.value - 1].concat(
        edge.node.user.nickname
      );
    }
  });
  const overlay = (
    <div>
      {starDict.map(
        (list, index) =>
          list.length > 0 && (
            <div key={`${props.puzzleId}-${index}`}>
              {index + 1}★: {list.join(', ')}
            </div>
          )
      )}
    </div>
  );
  if (starCount > 0) {
    return (
      <Tooltip position="top" html={overlay} theme="cindy">
        <PuzzleScore>
          <span className="glyphicon glyphicon-star" />
          <span>{`★${starCount}(${starSum})`}</span>
        </PuzzleScore>
      </Tooltip>
    );
  }
  return null;
}

StarLabel.propTypes = {
  starSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  puzzleId: PropTypes.string.isRequired,
};

export default StarLabel;
