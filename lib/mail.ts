import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)


export async function sendPasswordResetEmail(email:string, token:string){
    const link = `http:localhost:3000/reset-password?token=${token}`;

    return resend.emails.send({
        from: 'testing@resend.dev',
        to:email,
        subject: 'Reset your password',
        html: `
                <h1>You have requested to reset your password</h1>
                <p>Click the link below to reset your password</p>
                <a href="${link}">Reset password</a>
            `
    })
}