export async function POST() {
    // Set cookie options to clear the token
    const cookieOptions = [
        'auth=',
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        'Max-Age=0',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ].join('; ');

    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieOptions
        }
    });
} 