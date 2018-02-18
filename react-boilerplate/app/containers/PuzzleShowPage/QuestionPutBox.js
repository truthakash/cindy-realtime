import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { to_global_id as t } from 'common';
import { Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';
import { ButtonOutline, Input } from 'style-store';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import putQuestionMutation from 'graphql/CreateQuestionMutation';
import UserLabel from 'graphql/UserLabel';
import DialoguePanel from 'graphql/DialoguePanel';

import messages from './messages';

class QuestionPutBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({ content: e.target.value });
  }

  handleSubmit() {
    if (this.state.content === '') return;
    if (!this.props.currentUserId) return;
    const { puzzleId, currentUser } = this.props;
    const content = this.state.content;
    const now = new Date();
    const query = gql`
      query {
        puzzleShowUnion(id: $id)
          @connection(key: "PuzzleShowUnion_PuzzleShowUnion", filter: ["id"]) {
          edges {
            node {
              ... on DialogueNode {
                ...DialoguePanel
              }

              ... on HintNode {
                id
                content
                created
              }
            }
          }
        }
      }
      ${DialoguePanel}
    `;

    this.props
      .mutate({
        variables: {
          input: {
            content,
            puzzleId,
          },
        },
        update(proxy, { data: { createQuestion: { dialogue } } }) {
          const id = t('PuzzleNode', puzzleId);
          const data = proxy.readQuery({
            query,
            variables: { id },
          });
          data.puzzleShowUnion.edges.push({
            __typename: 'PuzzleShowUnionEdge',
            node: {
              good: false,
              true: false,
              question: content,
              user: currentUser,
              answer: null,
              questionEditTimes: 0,
              answerEditTimes: 0,
              answeredtime: null,
              ...dialogue,
            },
          });
          proxy.writeQuery({ query, variables: { id }, data });
        },
        optimisticResponse: {
          createQuestion: {
            __typename: 'CreateQuestionPayload',
            dialogue: {
              __typename: 'DialogueNode',
              id: t('DialogueNode', '-1'),
              created: now.toISOString(),
            },
          },
        },
      })
      .then(() => {})
      .catch((error) => {
        bootbox.alert(error.message);
      });
    this.setState({ content: '' });
  }

  render() {
    return (
      <Constrained level={3}>
        <Flex mx={-1}>
          <FormattedMessage
            {...messages[this.props.currentUserId ? 'input' : 'disableInput']}
          >
            {(msg) => (
              <Input
                value={this.state.content}
                disabled={this.props.currentUserId === undefined}
                placeholder={msg}
                onChange={this.handleInput}
                onKeyDown={this.handleKeyDown}
              />
            )}
          </FormattedMessage>
          <Box>
            <FormattedMessage {...messages.putQuestion}>
              {(msg) => (
                <ButtonOutline
                  onClick={this.handleSubmit}
                  disabled={!this.props.currentUserId}
                  style={{ wordBreak: 'keep-all' }}
                >
                  {msg}
                </ButtonOutline>
              )}
            </FormattedMessage>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

QuestionPutBox.propTypes = {
  mutate: PropTypes.func.isRequired,
  puzzleId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
  currentUser: PropTypes.object,
};

const withMutation = graphql(putQuestionMutation);

const withCurrentUser = graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        ...UserLabel_user
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: t('UserNode', currentUserId || '-1'),
      },
    }),
    props({ data }) {
      const { user: currentUser } = data;
      return { currentUser };
    },
  }
);

export default compose(withCurrentUser, withMutation)(QuestionPutBox);
