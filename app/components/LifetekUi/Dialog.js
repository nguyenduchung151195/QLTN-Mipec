import React from 'react';
import { Dialog as DialogUi, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function Dialog({ title, children, onClose, open, onSave, onCancel, saveText, cancelText, maxWidth, dialogAction, noClose, extraText, onExtra }) {
  return (
    <DialogUi fullWidth maxWidth={maxWidth} onClose={onClose} open={open}>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
        {' '}
        <Close onClick={onClose} />
      </div> */}

      {title ? <DialogTitle id="alert-dialog-title">{title}</DialogTitle> : null}

      <DialogContent className="dialog-content" style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </DialogContent>
      {dialogAction ? (
        <DialogActions>
          {onExtra && (
            <Button onClick={() => onExtra()} color="primary" variant="outlined">
              {extraText}
            </Button>
          )}
          {
            onSave ? (
              <Button onClick={onSave} color="primary" variant="outlined">
                {saveText}
              </Button>
            ) : null
          }
          {noClose ? null : <Button onClick={onCancel || onClose} color="secondary" variant="outlined">
            {cancelText}
          </Button>}

        </DialogActions>
      ) : null}
    </DialogUi>
  );
}
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
Dialog.defaultProps = {
  maxWidth: 'md',
  saveText: 'Lưu',
  cancelText: 'Hủy',
  dialogAction: true,
  TransitionComponent: Transition,
};
