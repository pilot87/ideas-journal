import base = Mocha.reporters.baseimport {gen_password, gen_username, gen_email} from './e2e.lib'const usernamec = 'customer' + gen_username(5)const passwordc = gen_password()const emailc = gen_email()describe('Auth operation', () => {    it('Errors while register', () => {        cy.visit('/')        cy.get('a[id=hello]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/register')        cy.get('button[id=register]').click()        cy.get('div[class=toast-header]').should('include.text', 'Error in')    })    it('Register test user', () => {        cy.visit('/')        cy.get('a[id=hello]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/register')        cy.get('input[id=email').type(emailc)        cy.get('input[id=username').type(usernamec)        cy.get('input[id=password').type(passwordc)        cy.get('button[id=register]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/login')        cy.get('input[id=username').type(usernamec)        cy.get('input[id=password').type(passwordc)        cy.get('button[id=login]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/about')        cy.get('label[class=form-label]').should('include.text', 'Password')    })})describe('Profile operation', () => {    it('should register, log in, change password, log out and log in again', () => {        cy.visit('/')        cy.get('a[id=hello]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/register')        cy.get('input[id=email').type('a' + emailc)        cy.get('input[id=username').type('a' + usernamec)        cy.get('input[id=password').type('a' + passwordc)        cy.get('button[id=register]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/login')        cy.get('input[id=username').type('a' + usernamec)        cy.get('input[id=password').type('a' + passwordc)        cy.get('button[id=login]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/about')        cy.get('input[id=password').type(passwordc)        cy.get('button[id=chpasswd').click()        cy.wait(2000)        cy.get('button[id=logout').click()        cy.location('pathname', {timeout: 60000})            .should('equal', '/')        cy.get('a[id=hello]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/register')        cy.get('a[id=login]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/login')        cy.get('input[id=username').type('a' + usernamec)        cy.get('input[id=password').type(passwordc)        cy.get('button[id=login]').click()        cy.location('pathname', {timeout: 60000})            .should('include', '/about')    })})