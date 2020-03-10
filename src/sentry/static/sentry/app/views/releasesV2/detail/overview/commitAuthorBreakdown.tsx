import React from 'react';
import styled from '@emotion/styled';
import round from 'lodash/round';

import {t, tn} from 'app/locale';
import space from 'app/styles/space';
import UserAvatar from 'app/components/avatar/userAvatar';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import AsyncComponent from 'app/components/asyncComponent';
import {percent} from 'app/utils';
import {userDisplayName} from 'app/utils/formatters';
import {Commit, User} from 'app/types';

type Props = {
  projectId: string;
  orgId: string;
  version: string;
  commitCount: number;
} & AsyncComponent['props'];

type State = {
  commits: Commit[];
} & AsyncComponent['state'];

class CommitAuthorBreakdown extends AsyncComponent<Props, State> {
  getDefaultState() {
    return {
      ...super.getDefaultState(),
    };
  }

  getEndpoints(): [string, string][] {
    const {projectId, orgId, version} = this.props;

    const commitsEndpoint = `/projects/${orgId}/${projectId}/releases/${encodeURIComponent(
      version
    )}/commits/`;

    return [['commits', commitsEndpoint]];
  }

  getDisplayPercent(authorCommitCount: number): string {
    const {commitCount} = this.props;

    const calculatedPercent = round(percent(authorCommitCount, commitCount), 0);

    return `${calculatedPercent < 1 ? '<1' : calculatedPercent}%`;
  }

  renderBody() {
    // group commits by author
    const groupedAuthorCommits = this.state.commits?.reduce(
      (authorCommitsAccumulator, commit) => {
        const email = commit.author?.email ?? 'undefined';

        if (authorCommitsAccumulator.hasOwnProperty(email)) {
          authorCommitsAccumulator[email].commitCount += 1;
        } else {
          authorCommitsAccumulator[email] = {
            commitCount: 1,
            author: commit.author,
          };
        }

        return authorCommitsAccumulator;
      },
      {} as {[key: string]: {author: User | undefined; commitCount: number}}
    );

    // sort authors by number of commits
    const sortedAuthorsByNumberOfCommits = Object.values(groupedAuthorCommits).sort(
      (a, b) => b.commitCount - a.commitCount
    );

    if (!sortedAuthorsByNumberOfCommits.length) {
      return null;
    }

    return (
      <Wrapper>
        <SectionHeading>{t('Commit Author Breakdown')}</SectionHeading>
        {sortedAuthorsByNumberOfCommits.map(({commitCount, author}) => (
          <AuthorLine key={author?.email}>
            <Author>
              <StyledUserAvatar user={author} size={20} hasTooltip />
              <AuthorName>{userDisplayName(author || {}, false)}</AuthorName>
            </Author>

            <Stats>
              <Commits>{tn('%s commit', '%s commits', commitCount)}</Commits>
              <Percent>{this.getDisplayPercent(commitCount)}</Percent>
            </Stats>
          </AuthorLine>
        ))}
      </Wrapper>
    );
  }
}

const SectionHeading = styled('h4')`
  color: ${p => p.theme.gray3};
  font-size: ${p => p.theme.fontSizeMedium};
  margin: ${space(1)} 0;
  padding-right: ${space(1)};
  line-height: 1.2;
`;

const Wrapper = styled('div')`
  font-size: ${p => p.theme.fontSizeSmall};
  margin-bottom: ${space(4)};
`;

const AuthorLine = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(0.5)};
`;

const Author = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

const StyledUserAvatar = styled(UserAvatar)`
  margin-right: ${space(1)};
`;

const AuthorName = styled('div')`
  font-weight: 600;
  color: ${p => p.theme.gray3};
  ${overflowEllipsis}
`;

const Stats = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 115px;
`;

const Commits = styled('div')`
  color: ${p => p.theme.gray2};
`;

const Percent = styled('div')`
  min-width: 40px;
  text-align: right;
  color: ${p => p.theme.gray4};
`;

export default CommitAuthorBreakdown;
