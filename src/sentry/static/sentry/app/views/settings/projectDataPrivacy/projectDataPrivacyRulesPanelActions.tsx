import React from 'react';
import styled from '@emotion/styled';

import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import {t} from 'app/locale';

type Props = {
  onCancel: (event: React.MouseEvent) => void;
  onSave: (event: React.MouseEvent) => void;
};

const projectDataPrivacyRulesPanelActions = ({onCancel, onSave}: Props) => (
  <StyledButtonBar gap={1.5}>
    <Button onClick={onCancel}>{t('Cancel')}</Button>
    <Button priority="primary" onClick={onSave}>
      {t('Save Rules')}
    </Button>
  </StyledButtonBar>
);

export default projectDataPrivacyRulesPanelActions;

const StyledButtonBar = styled(ButtonBar)`
  justify-content: flex-end;
`;
