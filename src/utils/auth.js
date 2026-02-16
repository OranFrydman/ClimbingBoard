// Utility functions for handling cookies and user authentication

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function getUser(field) {
  const email = getCookie('UserMail_C');
  const username = getCookie('UserName_C');
  
  if (field === 'email') {
    return email || 'Guest@Guest.Guest';
  }
  if (field === 'name') {
    return username || 'Guest';
  }
  return null;
}

export function isLoggedIn() {
  const email = getCookie('UserMail_C');
  return email && email !== 'Guest@Guest.Guest';
}

export function getGreeting() {
  const time = new Date().getHours();
  if (time < 12) return 'Good Morning!';
  if (time < 18) return 'Good Afternoon!';
  return 'Good Evening!';
}
