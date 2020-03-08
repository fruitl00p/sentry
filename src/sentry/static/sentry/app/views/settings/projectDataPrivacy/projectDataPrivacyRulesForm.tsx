import React from 'react';

import styled from '@emotion/styled';
import space from 'app/styles/space';
import {t} from 'app/locale';
import SelectControl from 'app/components/forms/selectControl';
import TextField from 'app/components/forms/textField';
import {IconDelete} from 'app/icons/iconDelete';
import Button from 'app/components/button';

import {
  getDataSelectorFieldLabel,
  getActionTypeSelectorFieldLabel,
  DATA_TYPE,
  ACTION_TYPE,
} from './utils';

export type RuleType = {
  id: number;
  action?: ACTION_TYPE;
  data?: DATA_TYPE;
  from?: string;
};

type Props = {
  onDelete?: () => void;
  onChange: (rule: RuleType) => void;
} & RuleType;

type State = Omit<RuleType, 'id'>;

class ProjectDataPrivacyRulesForm extends React.Component<Props, State> {
  state: State = {
    action: this.props.action || ACTION_TYPE.MASK,
    data: this.props.data || DATA_TYPE.CREDIT_CARD_NUMBERS,
    from: this.props.from,
  };

  handleChange = <T extends keyof State>(stateProperty: T, value: State[T]) => {
    this.setState(
      prevState => ({
        ...prevState,
        [stateProperty]: value,
      }),
      () => {
        this.props.onChange({
          id: this.props.id,
          ...this.state,
        });
      }
    );
  };

  handleOnDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    const {onDelete} = this.props;
    onDelete && onDelete();
  };

  render() {
    const {onDelete} = this.props;
    return (
      <Wrapper>
        <StyledSelectControl
          placeholder={t('Select an action')}
          name="action"
          options={Object.entries(ACTION_TYPE).map(([key, value]) => ({
            label: getActionTypeSelectorFieldLabel(ACTION_TYPE[key]),
            value,
          }))}
          value={this.state.action}
          onChange={({value}) => this.handleChange('action', value)}
          openOnFocus
          required
        />

        <StyledSelectControl
          placeholder={t('Select data')}
          name="data"
          options={Object.entries(DATA_TYPE).map(([key, value]) => ({
            label: getDataSelectorFieldLabel(DATA_TYPE[key]),
            value,
          }))}
          value={this.state.data}
          onChange={({value}) => this.handleChange('data', value)}
          openOnFocus
          required
        />

        <span>{t('from')}</span>
        <StyledTextField
          name="from"
          placeholder={t('ex. strings, numbers, custom')}
          onChange={(value: string) => {
            this.handleChange('from', value);
          }}
          value={this.props.from}
          inputStyle={{
            height: '100%',
          }}
          required
        />
        {onDelete && (
          <StyledIconTrash onClick={this.handleOnDelete}>
            <IconDelete />
          </StyledIconTrash>
        )}
      </Wrapper>
    );
  }
}

export default ProjectDataPrivacyRulesForm;

const Wrapper = styled('div')`
  padding: ${space(2)} ${space(3)};
  display: grid;
  grid-gap: ${space(2)};
  grid-template-columns: 157px 300px auto 1fr 40px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.offWhite2};
`;

const StyledSelectControl = styled(SelectControl)`
  height: 40px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 0px;
  width: 100%;
  height: 40px;
  > * {
    height: 100%;
    min-height: 100%;
  }
`;

const StyledIconTrash = styled(Button)`
  height: 40px;
  width: 40px;
`;
