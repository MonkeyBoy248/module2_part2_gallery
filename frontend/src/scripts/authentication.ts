const loginForm = document.forms?.namedItem("login");
const emailInput = loginForm?.elements.namedItem("email") as HTMLInputElement;
const passwordInput = loginForm?.elements.namedItem("password") as HTMLInputElement;
const submitButton = loginForm?.elements.namedItem("submit") as HTMLButtonElement;
const submitErrorContainer = loginForm?.querySelector('.login-form__submit-error-message');
const currentPage = currentUrl.searchParams.get('currentPage');
const authenticationEventsArray: CustomEventListener[] = [
  {target: emailInput, type: 'input', handler: validateEmailInput}, 
  {target: passwordInput, type: 'change', handler: validatePasswordInput},
  {target: loginForm as HTMLElement, type: 'submit', handler: submitForm}, 
  {target: loginForm as HTMLElement, type: 'focusin', handler: resetErrorMessage}
];

type AuthenticationResponse = TokenObject | AuthenticationErrorMessage;

function validateField (field: HTMLInputElement, pattern: RegExp, text: string): void {
  const targetErrorContainer = loginForm!.querySelector(`.login-form__${field.name}-error-message`) as HTMLElement;

  targetErrorContainer.textContent = '';
  submitButton.disabled = false;
  submitButton.classList.remove('_disabled')
  field.classList.remove('invalid');

  if (field.value.length !== 0 && !pattern.test(field.value)) {
    showErrorMessage(text, targetErrorContainer, field);
  }
}

function showErrorMessage (text: string, targetElement: HTMLElement, field: HTMLInputElement): void {
  targetElement.textContent = `${text}`;
  submitButton.disabled = true;
  submitButton.classList.add('_disabled');
  field.classList.add('invalid');
}

async function sendFormData (url: string) {
  const user: User = {
    email: emailInput.value,
    password: passwordInput.value,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user),
    })
  
    const data: AuthenticationResponse = await response.json();

    if ('token' in data) {
      return data;
    } 
    
    submitErrorContainer!.textContent = `${data.errorMessage}`;
  } catch (err) {
    console.log(err);
  }
}

function validateEmailInput (): void {
  const message = 'Wrong email format. Please, try again';
  const pattern = /[\w\d-_]+@([\w_-]+\.)+[\w]+/;

  validateField(emailInput, pattern, message);
}

function validatePasswordInput (): void {
  const message = 'Wrong password format. Please, try again';
  const pattern = /([a-zA-Z0-9]{8,})/;

  validateField(passwordInput, pattern, message);
}

async function submitForm (e: Event) {
  e.preventDefault();
  const response = await sendFormData(authenticationServerUrl); 

  if (response) {
    Token.setToken(response)
  }
  
  if (Token.getToken()) {
    ListenerRemover.removeEventListeners(authenticationEventsArray);
    redirectToTheGalleryPage();
  }
  
  emailInput.value = '';
  passwordInput.value = '';
}

function resetErrorMessage () {
  submitErrorContainer!.textContent = '';
}

emailInput.addEventListener('input', validateEmailInput);
passwordInput.addEventListener('change', validatePasswordInput);
loginForm!.addEventListener('submit', submitForm);
loginForm!.addEventListener('focusin', resetErrorMessage);







