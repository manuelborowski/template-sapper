import Polyglot from 'node-polyglot';

export let _ = new Polyglot();

const locale = process.env.LOCALE;

if (locale === 'en') {
  _.extend({
    username: "Username",
    level: 'level',
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
    formio: 'Form IO'
  })
} else {
  _.extend({
    username: "Gebruikersnaam",
    level: 'Niveau',
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
    formio: 'Form IO'
  })
}
