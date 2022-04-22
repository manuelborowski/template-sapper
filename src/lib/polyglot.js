import Polyglot from 'node-polyglot';

export let _ = new Polyglot();

const locale = process.env.LOCALE;

if (locale === 'en') {
  _.extend({
    username: "Username",
    level: 'level',
    role: 'role',
    home: "Home",
    admin: 'Administrator',
    user: 'User',
    users: 'Users',
    settings: 'Settings',
    datatables: 'Datatables',
    login: 'Login',
    logout: 'Logout',
    password: 'Password',
    log_in: 'Log in',
    formio: 'Form IO',
    column_visible: 'Column Visible',
    patience_please: 'Patience please',
  })
} else {
  _.extend({
    username: "Gebruikersnaam",
    level: 'Niveau',
    role: 'rol',
    home: "Startpagina",
    admin: 'Administrator',
    user: 'Gebruiker',
    users: 'Gebruikers',
    settings: 'Instellingen',
    datatables: 'Datatables',
    login: 'Aanmelden',
    logout: 'Afmelden',
    password: 'Wachtwoord',
    log_in: 'Aanmelden',
    formio: 'Form IO',
    column_visible: 'Kolom zichtbaar',
    patience_please: 'Even geduld',
  })
}
