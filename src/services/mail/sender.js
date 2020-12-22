const mailgun = require('mailgun-js')
const config = require('../../config')
const { logger } = require('../../lib')

const { API_KEY, DOMAIN } = config.mailing

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN })

class Mailing {
  constructor(mailgun = mg) {
    this.mg = mg
  }

  async send({ to, subject, template, vars }) {
    const data = {
      from: 'App Name <app@mail.com>',
      to,
      subject,
      template,
      vars,
      'h:X-Mailgun-Variables': { ...vars },
    }
    if (config.app.IS_PRODUCTION) {
      this.mg.send().send(data, (err) => {
        if (err) logger.error('Email error to: ', to)
        logger.info('Email sent to: ', to)
      })
    }
  }
}

exports.Mailing = Mailing

module.exports = new Mailing(mg)
