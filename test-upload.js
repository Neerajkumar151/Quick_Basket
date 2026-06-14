import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

async function test() {
  const form = new FormData();
  form.append('file', Buffer.from('test'), { filename: 'test.png', contentType: 'image/png' });
  try {
    const res = await fetch('https://cinema-jackal-disclose.ngrok-free.dev/api/v1/media/upload', {
      method: 'POST',
      body: form
    });
    console.log(await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();
