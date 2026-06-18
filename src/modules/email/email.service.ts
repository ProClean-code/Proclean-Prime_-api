import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmails(data: EmailDto) {
    await this.sendReservationEmail(data);
    await this.sendCustomerConfirmation(data);
  }

  async sendReservationEmail(data: EmailDto) {
    console.log('Enviando email con los siguientes datos:', data);
    console.log('Fechas recibidas:', data.fechas);

    try {
      const result = await this.resend.emails.send({
        from: 'direccion@pro-clean-prime.com',
        to: process.env.PRO_CLEAN_EMAIL!,
        subject: 'Nueva reserva recibida - ProClean Prime',
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #27272a; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #001e3c 0%, #003366 100%); color: white; padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
              .content { background: white; padding: 40px; border: 1px solid #f4f4f5; border-radius: 0 0 12px 12px; }
              .section { margin-bottom: 32px; }
              .section-title { font-size: 14px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #fbbf24; }
              .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
              .field-group.full { grid-template-columns: 1fr; }
              .field { background: #fafafa; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #fbbf24; }
              .field-label { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
              .field-value { font-size: 15px; color: #27272a; font-weight: 500; }
              .field-value.empty { color: #a1a1aa; font-style: italic; }
              .dates-container { background: #fafafa; padding: 16px; border-radius: 8px; border-left: 4px solid #fbbf24; }
              .dates-list { display: flex; flex-wrap: wrap; gap: 8px; }
              .date-badge { background: #fbbf24; color: #001e3c; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; }
              .divider { background: #f4f4f5; height: 1px; margin: 24px 0; }
              .footer { background: #fafafa; padding: 20px; border-radius: 8px; text-align: center; font-size: 12px; color: #71717a; }
              .cta-info { background: #fffbeb; border-left: 4px solid #fbbf24; padding: 16px; border-radius: 8px; margin-top: 16px; }
              .cta-info p { margin: 0; font-size: 13px; color: #78350f; }
              @media (max-width: 600px) { .field-group { grid-template-columns: 1fr; } .header h1 { font-size: 24px; } }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nueva Reserva Recibida</h1>
                <p>ProClean Prime - Servicio de Limpieza Profesional</p>
              </div>

              <div class="content">
                <!-- INFORMACIÓN DEL CLIENTE -->
                <div class="section">
                  <div class="section-title">📋 Información del Cliente</div>
                  <div class="field-group">
                    <div class="field">
                      <div class="field-label">Nombre</div>
                      <div class="field-value">${data.nombre} ${data.apellido}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Correo Electrónico</div>
                      <div class="field-value">${data.correo}</div>
                    </div>
                  </div>
                  <div class="field-group">
                    <div class="field">
                      <div class="field-label">Teléfono</div>
                      <div class="field-value">${data.celular}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Referido por</div>
                      <div class="field-value">${data.referido || 'No especificado'}</div>
                    </div>
                  </div>
                </div>

                <!-- IDENTIFICACIÓN -->
                <div class="section">
                  <div class="section-title">🆔 Identificación</div>
                  <div class="field-group">
                    <div class="field">
                      <div class="field-label">Tipo de Documento</div>
                      <div class="field-value">${data.tipoDocumento}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Número de Documento</div>
                      <div class="field-value">${data.numeroDocumento}</div>
                    </div>
                  </div>
                </div>

                <!-- UBICACIÓN -->
                <div class="section">
                  <div class="section-title">📍 Ubicación del Servicio</div>
                  <div class="field-group full">
                    <div class="field">
                      <div class="field-label">Barrio</div>
                      <div class="field-value">${data.barrio}</div>
                    </div>
                  </div>
                  <div class="field-group full">
                    <div class="field">
                      <div class="field-label">Dirección</div>
                      <div class="field-value">${data.direccion}</div>
                    </div>
                  </div>
                  <div class="field-group">
                    <div class="field">
                      <div class="field-label">Apartamento / Edificio</div>
                      <div class="field-value ${!data.apartamento ? 'empty' : ''}">${data.apartamento || 'No especificado'}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Indicaciones de Llegada</div>
                      <div class="field-value ${!data.llegada ? 'empty' : ''}">${data.llegada || 'Ninguna'}</div>
                    </div>
                  </div>
                </div>

                <!-- DETALLES DEL SERVICIO -->
                <div class="section">
                  <div class="section-title">✨ Detalles del Servicio</div>
                  <div class="field-group">
                    <div class="field">
                      <div class="field-label">Plan de Servicio</div>
                      <div class="field-value">${data.planServicio}</div>
                    </div>
                    <div class="field">
                      <div class="field-label">Hora Preferida</div>
                      <div class="field-value">${data.hora}</div>
                    </div>
                  </div>
                  <div class="field-group full">
                    <div class="dates-container">
                      <div class="field-label" style="border-bottom: none; padding-bottom: 0; margin-bottom: 12px;">📅 Fechas de Servicio</div>
                      <div class="dates-list">
                        ${data.fechas.map((fecha) => `<span class="date-badge">${fecha}</span>`).join('')}
                      </div>
                    </div>
                  </div>
                  ${
                    data.requerimientos
                      ? `
                    <div class="field-group full">
                      <div class="field">
                        <div class="field-label">Requerimientos Especiales</div>
                        <div class="field-value">${data.requerimientos}</div>
                      </div>
                    </div>
                  `
                      : ''
                  }
                </div>

                <div class="divider"></div>

                <div class="cta-info">
                  <p><strong>⚠️ Próximo Paso:</strong> Revisa los detalles de esta reserva y contacta al cliente para confirmar la fecha, hora y cualquier detalle adicional necesario.</p>
                </div>

                <div class="footer">
                  <p>Este email fue generado automáticamente por el sistema de reservas de ProClean Prime.</p>
                  <p style="margin-top: 8px;">© 2024 ProClean Prime. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      });
      console.log('Resultado envío reserva:', result);
      return result;
    } catch (error) {
      console.error('Error enviando email de reserva:', error);
      throw error;
    }
  }

  async sendCustomerConfirmation(data: EmailDto) {
    console.log(
      'Enviando email de confirmación al cliente con los siguientes datos:',
      data,
    );
    console.log('Correo del cliente:', data.correo);

    try {
      const result = await this.resend.emails.send({
        from: 'direccion@pro-clean-prime.com',
        to: data.correo,
        subject: 'Hemos recibido tu solicitud - ProClean Prime',
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #27272a; background: #f9fafb; }
              .container { max-width: 600px; margin: 40px auto; padding: 0; }
              .header { background: linear-gradient(135deg, #001e3c 0%, #003366 100%); color: white; padding: 60px 40px; border-radius: 16px 16px 0 0; text-align: center; }
              .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }
              .header p { margin: 12px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 500; }
              .content { background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
              .message { font-size: 16px; color: #404045; line-height: 1.8; margin: 0 0 24px 0; }
              .highlight { color: #001e3c; font-weight: 600; }
              .summary-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #fbbf24; border-radius: 12px; padding: 24px; margin: 32px 0; }
              .summary-title { font-size: 14px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
              .summary-item { display: flex; margin-bottom: 12px; font-size: 15px; }
              .summary-label { color: #78350f; font-weight: 600; width: 140px; }
              .summary-value { color: #401f0a; font-weight: 500; }
              .next-steps { background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 32px 0; }
              .next-steps-title { font-size: 14px; font-weight: 700; color: #001e3c; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; display: flex; align-items: center; }
              .next-steps-list { list-style: none; padding: 0; margin: 0; }
              .next-steps-list li { font-size: 15px; color: #404045; margin-bottom: 12px; padding-left: 28px; position: relative; }
              .next-steps-list li:before { content: '✓'; position: absolute; left: 0; color: #fbbf24; font-weight: 700; font-size: 18px; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #001e3c; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 24px; transition: transform 0.2s; text-align: center; }
              .cta-button:hover { transform: scale(1.05); }
              .divider { background: #e5e7eb; height: 1px; margin: 32px 0; }
              .footer { background: #f9fafb; padding: 24px; border-radius: 12px; text-align: center; font-size: 12px; color: #71717a; margin-top: 32px; }
              .footer p { margin: 4px 0; }
              @media (max-width: 600px) { .header { padding: 40px 20px; } .content { padding: 20px; } .summary-box, .next-steps { padding: 16px; } }
            </style>
          </head>
          <body style="margin: 0; padding: 0; background: #f9fafb;">
            <div class="container">
              <div class="header">
                <h1>¡Gracias por tu solicitud!</h1>
                <p>Hemos recibido tu reserva de servicio</p>
              </div>

              <div class="content">
                <p class="message">
                  Hola <span class="highlight">${data.nombre}</span>,
                </p>

                <p class="message">
                  Agradecemos tu confianza en <span class="highlight">ProClean Prime</span>. Hemos recibido correctamente tu solicitud de servicio de limpieza. Nuestro equipo ya está revisando los detalles de tu reserva.
                </p>

                <div class="summary-box">
                  <div class="summary-title">📋 Resumen de tu Solicitud</div>
                  <div class="summary-item">
                    <div class="summary-label">Correo:</div>
                    <div class="summary-value">${data.correo}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Teléfono:</div>
                    <div class="summary-value">${data.celular}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Plan de Servicio:</div>
                    <div class="summary-value">${data.planServicio}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Fechas:</div>
                    <div class="summary-value">${Array.isArray(data.fechas) ? data.fechas.join(', ') : 'Por confirmar'}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Hora:</div>
                    <div class="summary-value">${data.hora}</div>
                  </div>
                </div>

                <div class="next-steps">
                  <div class="next-steps-title">⏱️ Próximos Pasos</div>
                  <ul class="next-steps-list">
                    <li>Nuestro equipo revisará tu solicitud en las próximas 2-4 horas</li>
                    <li>Te contactaremos por teléfono o correo para confirmar los detalles</li>
                    <li>Acordaremos la hora exacta del servicio contigo</li>
                    <li>Recibirás un recordatorio 24 horas antes del servicio</li>
                  </ul>
                </div>

                <p class="message">
                  Si tienes cualquier pregunta o necesitas hacer cambios en tu reserva, no dudes en contactarnos directamente. Estamos aquí para ayudarte.
                </p>

                <div class="divider"></div>

                <p class="message" style="font-size: 14px; color: #71717a; margin-bottom: 0;">
                  Este email fue generado automáticamente. Por favor, no respondas a este mensaje. Si necesitas asistencia, contacta directamente con nuestro equipo.
                </p>

                <div class="footer">
                  <p><strong>ProClean Prime</strong></p>
                  <p>Servicio de Limpieza Profesional de Confianza</p>
                  <p style="margin-top: 12px; color: #a1a1aa;">© 2024 ProClean Prime. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      });
      console.log('Resultado envío confirmación al cliente:', result);
      return result;
    } catch (error) {
      console.error('Error enviando email de confirmación al cliente:', error);
      throw error;
    }
  }
}
