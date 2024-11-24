import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  customerName: string;
  orderItems: OrderItem[];
  grandTotal: number;
  contactEmail: string;
  companyName: string;
  year: number;
}

const transporter = nodemailer.createTransport({
  service: "Zoho",
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "xevolz99@gmail.com",
    pass: "Lilo.15042006",
  },
  requireTLS: true,
});

export const sendOrderInvoice = async (options: EmailOptions) => {
  const templatePath = path.resolve(__dirname, '../templates/invoice.ejs');
  
  const html = await ejs.renderFile(templatePath, {
    customerName: options.customerName,
    orderItems: options.orderItems,
    grandTotal: options.grandTotal,
    contactEmail: options.contactEmail,
    companyName: options.companyName,
    year: options.year,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
