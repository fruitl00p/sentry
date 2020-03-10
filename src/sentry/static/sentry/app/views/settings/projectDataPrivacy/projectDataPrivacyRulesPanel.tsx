import React from 'react';

import space from 'app/styles/space';
import styled from '@emotion/styled';
import {t} from 'app/locale';
import {Panel, PanelHeader, PanelBody} from 'app/components/panels';
import Link from 'app/components/links/link';
import {IconAdd} from 'app/icons/iconAdd';

import ProjectDataPrivacyRulesForm, {RuleType} from './projectDataPrivacyRulesForm';
import ProjectDataPrivacyRulesPanelActions from './projectDataPrivacyRulesPanelActions';
import {DATA_TYPE, ACTION_TYPE} from './utils';

type State = {
  rules: Array<RuleType>;
  savedRules: Array<RuleType>;
  isLoading: boolean;
};

let rulesFromServer: Array<RuleType> = [
  {
    id: 1,
    action: ACTION_TYPE.MASK,
    data: DATA_TYPE.BANK_ACCOUNTS,
    from: 'api_key && !$object',
  },
  {
    id: 2,
    action: ACTION_TYPE.REMOVE,
    data: DATA_TYPE.IP_ADDRESSES,
    from: 'xxx && xxx',
  },
];

class ProjectDataPrivacyRulesPanel extends React.Component<{}, State> {
  state: State = {
    rules: [],
    savedRules: [],
    isLoading: true,
  };

  componentDidMount() {
    this.loadSavedRules();
  }

  loadSavedRules = () => {
    // add request here
    setTimeout(function() {
      new Promise(resolve => resolve(rulesFromServer)).then(result => {
        this.setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      });
    }, 3000);
  };

  formRef: React.RefObject<HTMLFormElement> = React.createRef();

  handleAddRule = () => {
    this.setState(prevState => ({
      rules: [
        ...prevState.rules,
        {
          id: prevState.rules.length + 1,
        },
      ],
    }));
  };

  handleDeleteRule = (ruleId: number) => () => {
    this.setState(
      prevState => ({
        rules: prevState.rules.filter(rule => rule.id !== ruleId),
      }),
      () => {
        if (this.state.rules.length === 0) {
          this.handleAddRule();
        }
      }
    );
  };

  handleSaveForm = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.formRef.current?.dispatchEvent(new Event('submit'));
  };

  handleChange = (updatedRule: RuleType) => {
    this.setState(prevState => ({
      ...prevState,
      rules: prevState.rules.map(rule => {
        if (rule.id === updatedRule.id) {
          return updatedRule;
        }
        return rule;
      }),
    }));
  };

  handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    rulesFromServer = this.state.rules;
  };

  handleCancelForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState(prevState => ({
      rules: prevState.savedRules,
    }));
  };

  render() {
    const {rules} = this.state;
    return (
      <React.Fragment>
        <Panel>
          <PanelHeader>{t('Data Privacy Rules')}</PanelHeader>
          <PanelBody>
            <form
              style={{marginBottom: 0}}
              onSubmit={this.handleSubmitForm}
              ref={this.formRef}
            >
              {rules.map(rule => (
                <ProjectDataPrivacyRulesForm
                  key={rule.id}
                  onDelete={this.handleDeleteRule(rule.id)}
                  onChange={this.handleChange}
                  {...rule}
                />
              ))}
            </form>
            <PanelAction>
              <StyledLink onClick={this.handleAddRule}>
                <IconAdd circle />
                <span>{t('Add Rule')}</span>
              </StyledLink>
            </PanelAction>
          </PanelBody>
        </Panel>
        <ProjectDataPrivacyRulesPanelActions
          onSave={this.handleSaveForm}
          onCancel={this.handleCancelForm}
        />
      </React.Fragment>
    );
  }
}

export default ProjectDataPrivacyRulesPanel;

const PanelAction = styled('div')`
  padding: ${space(2)} ${space(3)};
`;

// TODO(style): clarify if the color below should be added to the theme or if we should use another color - #3d74db
const StyledLink = styled(Link)`
  display: inline-grid;
  grid-gap: ${space(0.5)};
  grid-template-columns: auto auto;
  align-items: center;
  color: #3d74db;
`;
