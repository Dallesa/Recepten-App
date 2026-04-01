import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await isAuthenticated();
    if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'Geen bestand meegegeven' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Alleen afbeeldingen zijn toegestaan' }, { status: 400 });
    }

    console.log('File info:', { name: file.name, type: file.type, size: file.size });
    console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

    let blob;
    try {
      blob = await put(`campings/${Date.now()}-${file.name}`, file, {
        access: 'public'
      });
      console.log('Upload successful:', blob.url);
    } catch (blobError) {
      console.error('Blob put error:', blobError);
      const errorMsg = blobError instanceof Error ? blobError.message : String(blobError);
      return NextResponse.json({ error: `Blob upload failed: ${errorMsg}` }, { status: 500 });
    }

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Uploaden mislukt: ${errorMsg}` }, { status: 500 });
  }
}