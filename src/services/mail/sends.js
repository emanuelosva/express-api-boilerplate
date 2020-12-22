const Mailing = require('./sender')
const { templates } = require('./contants')
const config = require('../../config')

module.exports = {
  welcome: async (to, { name, token }) => Mailing.send({
    to,
    vars: {
      name,
      confirmAccountUrl: `${config.app.CONFIRM_ACCOUNT_URL}?token=${token}`,
    },
    subject: 'Bienvenido a my App',
    template: templates.cmr.welcome,
  }),
}
