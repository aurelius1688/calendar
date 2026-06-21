export async function onRequest(context) {
    return new Response(JSON.stringify({
        success: true,
        message: "API is working",
        time: new Date().toISOString()
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
