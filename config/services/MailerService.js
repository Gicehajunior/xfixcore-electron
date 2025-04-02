"use strict";
require('dotenv').config();
const mail = require('@config/app/mail');
const Nodemailer = require("nodemailer");
  
class Mailer {
    constructor(
        mail_host = undefined, 
        mail_port = undefined, 
        mail_source_address = undefined, 
        mail_encryption_criteria = undefined, 
        email_username = undefined, 
        email_password = undefined
    ) {
        this.mail_host = (mail.mailer.smtp.host) ? mail.mailer.smtp.host : mail_host;
        this.mail_port = (mail.mailer.smtp.port) ? mail.mailer.smtp.port : mail_port;
        this.mail_encryption_criteria = (mail.mailer.smtp.encryption_criteria) ? mail.mailer.smtp.encryption_criteria : mail_encryption_criteria;
        this.mail_source_address = (mail.source.email_address) ? mail.source.email_address : mail_source_address;
        this.email_username = (mail.source.email_username) ? mail.source.email_username : email_username;
        this.email_password = (mail.source.email_password) ? mail.source.email_password : email_password;
    }

    async send(recipients=[], subject, html_message_formart, text_message_formart = undefined, attachments=undefined) {  
        // create reusable transporter object using the default SMTP transport
        let response = undefined;

        try {
            let attachments_array = [];
            
            if (attachments !== undefined && Array.isArray(attachments)) {
                attachments.forEach(file => {
                    if (typeof file === 'string') { 
                        attachments_array.push({
                            filename: file.split('/').pop(),
                            path: file
                        });
                    } else if (file && file.filename && file.content) { 
                        attachments_array.push({
                            filename: file.filename,
                            content: file.content 
                        });
                    }
                });
            }

            let transporter = Nodemailer.createTransport({
                host: this.mail_host,
                port: this.mail_port,
                secure: (this.mail_port == 465) ? true : false, // true for 465, false for other ports
                auth: {
                    user: this.mail_source_address,  
                    pass: this.email_password,  
                },
            });
     
            const response_promise = await transporter.sendMail({
                from: `${this.email_username} <${this.mail_source_address}>`, // sender address
                to: Array.isArray(recipients) ? recipients : [recipients], // list of receivers
                subject: subject, // Subject line
                text: text_message_formart?.length > 0 ? String(text_message_formart) : '', // plain text body
                html: html_message_formart?.length > 0 ? String(html_message_formart) : '', // html body
                attachments: attachments_array?.length > 0 ? attachments_array : undefined
            }); 

            response = response_promise;  
        } catch (error) {
            console.log(`MAIL SERVICE ERROR: ${error}`);
            response = false;
        } 

        return response;
    }
}

module.exports = Mailer;



