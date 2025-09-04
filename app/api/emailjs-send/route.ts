// import { NextResponse } from 'next/server';
// import emailjs from '@emailjs/nodejs';

// export async function POST(req: Request) {
//   const { email, subject, message, fullName, templateId } = await req.json();

//   try {
//     const serviceId = process.env.EMAILJS_SERVICE_ID;
//     const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

//     if (!serviceId || !templateId || !publicKey) {
//       return NextResponse.json(
//         { message: 'EmailJS credentials are not set' },
//         { status: 500 }
//       );
//     }

//     await emailjs.send(
//       serviceId,
//       templateId,
//       {
//         to_email: email,
//         subject,
//         message,
//         to_name: fullname,
//       },
//       {
//         publicKey: publicKey,
//       }
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error sending email with EmailJS:', error);
//     return NextResponse.json(
//       { message: 'Failed to send email' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';
import config from '@/lib/config';

export async function POST(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const { email, subject, message, fullName, templateId } = await req.json();

    console.log('Received email request:', { email, subject, templateId });

    const serviceId = config.env.emailjs.serviceId;
    const publicKey = config.env.emailjs.publicKey;
    const privateKey = config.env.emailjs.privateKey;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.error('Missing EmailJS credentials:', {
        serviceId: !!serviceId,
        templateId: !!templateId,
        publicKey: !!publicKey,
        privateKey: !!privateKey,
      });

      return NextResponse.json(
        { message: 'EmailJS credentials are not set' },
        { status: 500, headers }
      );
    }

    const emailjsResponse = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        subject: subject,
        message: message,
        to_name: fullName,
        from_name: 'UniLib',
        reply_to: 'devdevgrin@gmail.com',
      },
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    return NextResponse.json(
      { success: true, response: emailjsResponse },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error sending email with EmailJS:', error);
    return NextResponse.json(
      {
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers }
    );
  }
}
