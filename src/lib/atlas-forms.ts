export function validateAtlasText(value: string, required: boolean, maxLength: number) {
  if (required && !value.trim()) return 'required';
  if (maxLength >= 0 && value.length > maxLength) return 'length';
  return null;
}

/** Native fields keep their semantics; errors are visible beside the field. */
export function bindAtlasForm(form: HTMLFormElement, onValid: () => void) {
  const fields = [...form.querySelectorAll<HTMLInputElement>('[data-validated-field]')];
  const check = (field: HTMLInputElement) => {
    const problem = validateAtlasText(field.value, field.required, field.maxLength);
    const error = document.getElementById(field.getAttribute('aria-describedby')!)!;
    field.setAttribute('aria-invalid', String(!!problem));
    error.hidden = !problem;
    error.textContent = problem ? field.dataset[`${problem}Error`]! : '';
    return !problem;
  };
  form.noValidate = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = fields.filter(field => !check(field));
    form.dataset.state = invalid.length ? 'error' : 'success';
    if (invalid.length) {
      const feedback = form.querySelector('[data-form-feedback]');
      if (feedback) feedback.textContent = '';
      invalid[0].focus();
    } else onValid();
  });
  form.addEventListener('input', () => {
    form.dataset.state = 'editing';
    const feedback = form.querySelector('[data-form-feedback]');
    if (feedback) feedback.textContent = '';
  });
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') check(field);
  }));
}
