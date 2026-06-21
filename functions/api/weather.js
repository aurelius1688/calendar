export async function onRequest(context) {
    try {
        const response = await fetch('https://uapis.cn/api/v1/misc/weather', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();

        return new Response(JSON.stringify({
            success: true,
            weather: data.weather || '未知',
            temperature: data.temperature || '--'
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({
            success: true,
            weather: '未知',
            temperature: '--'
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
