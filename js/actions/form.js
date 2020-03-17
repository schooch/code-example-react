export function setFormDirty(dirty) {
  return {
    type: 'FORM_DIRTY',
    payload: dirty
  }
}