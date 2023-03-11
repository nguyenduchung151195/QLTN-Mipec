/**
 *
 * TextFieldCode
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { TextField } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function TextFieldCode(props) {
  const [codeGenerate, setCodeGenerate] = React.useState('');
  const [codeConfig] = React.useState(() => JSON.parse(localStorage.getItem('codeConfig')));

  React.useEffect(
    () => {
      if (codeConfig) {
        const codeConfigForCodeProps = codeConfig.find(item => Number(item.code) === Number(props.code));
        if (codeConfigForCodeProps) {
          switch (Number(codeConfigForCodeProps.method)) {
            case 0:
              setCodeGenerate(codeConfigForCodeProps.prefix + new Date().valueOf() + codeConfigForCodeProps.suffixes);
              break;
            default:
              break;
          }
          if (!props.value) {
            props.onChange({
              target: {
                value: codeGenerate,
                name: props.name,
              },
            });
          }
        }
      }
    },
    [props],
  );
  return <CustomInputBase disabled defaultValue={codeGenerate} {...props} />;
}

TextFieldCode.propTypes = {};

export default TextFieldCode;
