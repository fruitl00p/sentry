import React from 'react';

import space from 'app/styles/space';
import styled from '@emotion/styled';
import {t} from 'app/locale';
import {Panel, PanelHeader, PanelBody} from 'app/components/panels';
import Link from 'app/components/links/link';
import {IconAdd} from 'app/icons/iconAdd';

import ProjectDataPrivacyRulesForm, {RuleType} from './projectDataPrivacyRulesForm';
import ProjectDataPrivacyRulesPanelActions from './projectDataPrivacyRulesPanelActions';

type State = {
  rules: Array<RuleType>;
};

class ProjectDataPrivacyRulesPanel extends React.Component<{}, State> {
  state: State = {
    rules: [],
  };

  componentDidMount() {
    this.handleAddRule();
  }

  formRef: React.RefObject<HTMLFormElement> = React.createRef();

  handleAddRule = () => {
    this.setState(prevState => ({
      rules: [
        ...prevState.rules,
        {
          id: prevState.rules.length,
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
    console.log('submitting form', this.state.rules);
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
          onCancel={() => console.log('onCancel')}
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
