import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
    
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
      });

      //informacion del email

      const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com',
        to: email,
        subject: "UpTask - Confirma tu Cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el seguiente enlace:
        
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        
        `,
      })
};

export const emailOlvidePassword = async (datos) => {
    
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    //informacion del email

    const info = await transport.sendMail({
      from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com',
      to: email,
      subject: "UpTask - Reestablece tu contraseña",
      text: "Reestablece tu contraseña en UpTask",
      html: `<p>Hola: ${nombre} has solicitado reestablecer tu contraseña en UpTask</p>
      <p>Hazlo en el seguiente enlace:
      
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
      
      <p>Si no fuiste tu, puedes ignorar el mensaje</p>
      
      
      `,
    })
};