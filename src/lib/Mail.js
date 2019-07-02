import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    // Como o nodemail chama uma conexão com serviço externo
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // Se não tiver usuário, passo null. Não é obrigatório ter usuário
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // Método compile é usado pelo nodemailer pra renderizar os html
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  /**
   * Não chamo o método transporter no constructor pois preciso concatenar os dados Default do config/mail
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default, // ... significa que estou pegando todo conteúdo de default
      ...message,
    });
  }
}
export default new Mail();
