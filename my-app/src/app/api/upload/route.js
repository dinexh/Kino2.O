import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const email = formData.get('email');

        if (!file) {
            return NextResponse.json(
                { error: "No file received." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const extension = path.extname(originalName);
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize email for filename
        const filename = `${sanitizedEmail}-${timestamp}${extension}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payment-screenshots');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save to public/uploads/payment-screenshots
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the public URL path
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host');
        const fullUrl = `${protocol}://${host}`;

        return NextResponse.json({ 
            message: "File uploaded successfully",
            filename: `/uploads/payment-screenshots/${filename}`,
            fullUrl: `${fullUrl}/uploads/payment-screenshots/${filename}`
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: "Error uploading file.", details: error.message },
            { status: 500 }
        );
    }
} 