import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const PuzzleList = gql`
  query PuzzleListInitQuery(
    $orderBy: [String]
    $offset: Int
    $limit: Int
    $status: Float
    $status__gt: Float
    $title__contains: String
    $user: ID
  ) {
    allPuzzles(
      offset: $offset
      limit: $limit
      orderBy: $orderBy
      status: $status
      status_Gt: $status__gt
      title_Contains: $title__contains
      user: $user
    )
      @connection(
        key: "PuzzleNode_allPuzzles"
        filter: ["orderBy", "user", "offset", "title_Contains"]
      ) {
      edges {
        node {
          id
          ...PuzzlePanel_node
        }
      }
      totalCount
    }
  }
  ${PuzzlePanel}
`;

export default PuzzleList;
