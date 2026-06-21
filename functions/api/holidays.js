export async function onRequest(context) {
    const url = new URL(context.request.url);
    const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear();

    try {
        const apiUrl = `https://uapis.cn/api/v1/misc/holiday-calendar?year=${year}`;
        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();

        if (!data.days) {
            return new Response(JSON.stringify({ success: false, error: 'No data' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const holidays = {};
        data.days.forEach(d => {
            if (d.is_holiday) {
                const month = d.month;
                const day = d.day;
                if (!holidays[month]) holidays[month] = {};
                holidays[month][day] = {
                    isHoliday: true,
                    holidayName: d.legal_holiday_name || d.solar_festival || d.lunar_festival || null
                };
            }
        });

        return new Response(JSON.stringify({
            success: true,
            year,
            holidays
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
