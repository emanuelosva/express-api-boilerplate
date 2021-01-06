/**
 * Mailer class.
 * -------------
 *
 * This class provides all functionalities
 * to send any type of emails.
 */

const mailgun = require('mailgun-js')
const config = require('../../config')
const { Logger } = require('../../lib')

const getMailgunConf = () => {
  const mailConfig = {
    apiKey: config.mailing.API_KEY,
    domain: config.mailing.DOMAIN,
  }
  if (!config.app.IS_PRODUCTION) mailConfig.testMode = true
  return mailConfig
}

class Mailer {
  static driver = mailgun(getMailgunConf())
  static config = config.mailing
  static logger = new Logger('mailing')

  static async send({ to, subject, content }) {
    const data = {
      from: 'App Name <app@mail.com>',
      to: [to],
      subject,
      text: content,
    }
    const emailResponse = await this._sendMail(data)
    return emailResponse
  }

  static async sendFromTemplate({ to, subject, template, vars }) {
    const data = {
      from: 'App Name <app@mail.com>',
      to: [to],
      subject,
      template,
      'h:X-Mailgun-Variables': { ...vars },
    }
    const emailResponse = await this._sendMail(data)
    return emailResponse
  }

  static _sendMail(data) {
    return new Promise((resolve, reject) => {
      this.driver.messages().send(data, (err, body) => {
        if (err) return reject(err)
        this.logger.info(`Email sent to ${data.to}`)
        return resolve(body)
      })
    })
  }
}

module.exports = Mailer
