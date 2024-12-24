export async function POST() {
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            // Clear the auth cookie
            'Set-Cookie': 'auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
        }
    });
} 