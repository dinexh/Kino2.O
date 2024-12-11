import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ 
                error: "Invalid file type. Please upload a JPG or PNG image." 
            }, { status: 400 });
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ 
                error: "File size too large. Please upload an image less than 5MB." 
            }, { status: 400 });
        }

        // Ensure uploads directory exists
        const uploadsDir = join(process.cwd(), 'public/uploads');
        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const uniqueFilename = `payment-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const filePath = join(uploadsDir, uniqueFilename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise((resolve, reject) => {
            const stream = createWriteStream(filePath);
            
            stream.on('error', (error) => {
                console.error('Error writing file:', error);
                resolve(NextResponse.json({ 
                    error: "Failed to save file" 
                }, { status: 500 }));
            });

            stream.on('finish', () => {
                resolve(NextResponse.json({ 
                    message: "File uploaded successfully",
                    filename: uniqueFilename 
                }));
            });

            stream.write(buffer);
            stream.end();
        });

    } catch (error) {
        console.error('Error processing upload:', error);
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
} 