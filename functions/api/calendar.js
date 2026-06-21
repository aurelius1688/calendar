export async function onRequest(context) {
    const url = new URL(context.request.url);
    const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(url.searchParams.get('month')) || new Date().getMonth() + 1;

    // 简化的农历计算（基于已知数据）
    const LUNAR_DATA = {
        2026: {
            6: {
                1: '初二', 2: '初三', 3: '初四', 4: '初五', 5: '初六', 6: '初七',
                7: '初八', 8: '初九', 9: '初十', 10: '十一', 11: '十二', 12: '十三',
                13: '十四', 14: '十五', 15: '十六', 16: '十七', 17: '十八', 18: '十九',
                19: '二十', 20: '廿一', 21: '端午', 22: '廿三', 23: '廿四', 24: '廿五',
                25: '廿六', 26: '廿七', 27: '廿八', 28: '廿九', 29: '三十', 30: '初一'
            },
            7: {
                1: '初二', 2: '初三', 3: '初四', 4: '初五', 5: '初六', 6: '初七',
                7: '初八', 8: '初九', 9: '初十', 10: '十一', 11: '十二', 12: '十三',
                13: '十四', 14: '十五', 15: '十六', 16: '十七', 17: '十八', 18: '十九',
                19: '二十', 20: '廿一', 21: '廿二', 22: '廿三', 23: '廿四', 24: '廿五',
                25: '廿六', 26: '廿七', 27: '廿八', 28: '廿九', 29: '三十', 30: '初一', 31: '初二'
            }
        }
    };

    // 节假日数据
    const HOLIDAYS = {
        2026: {
            '6-14': '端午节', '6-15': '端午节', '6-16': '端午节',
            '10-1': '国庆节', '10-2': '国庆节', '10-3': '国庆节', '10-4': '国庆节', '10-5': '国庆节', '10-6': '国庆节', '10-7': '国庆节'
        }
    };

    // 二十四节气
    const SOLAR_TERMS = {
        2026: {
            '6-21': '夏至', '7-7': '小暑', '7-22': '大暑',
            '8-7': '立秋', '8-23': '处暑', '9-7': '白露', '9-23': '秋分'
        }
    };

    try {
        const daysInMonth = new Date(year, month, 0).getDate();
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

        // 计算周一开始的位置
        const firstDay = new Date(year, month - 1, 1).getDay();
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        const allDays = [];
        const lunarMonth = month <= 6 ? '五月' : '六月'; // 简化

        // 上月
        for (let i = startDay - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            allDays.push({
                day: d,
                month: prevMonth,
                year: prevYear,
                currentMonth: false,
                is_weekend: false,
                is_holiday: false,
                holiday_name: null,
                solar_term: null,
                lunar_day_name: '',
                lunar_month_name: ''
            });
        }

        // 当月
        for (let i = 1; i <= daysInMonth; i++) {
            const dayOfWeek = new Date(year, month - 1, i).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const dateKey = `${month}-${i}`;
            const holidayName = HOLIDAYS[year]?.[dateKey] || null;
            const solarTerm = SOLAR_TERMS[year]?.[dateKey] || null;
            const lunarDay = LUNAR_DATA[year]?.[month]?.[i] || '';

            allDays.push({
                day: i,
                month: month,
                year: year,
                currentMonth: true,
                is_weekend: isWeekend,
                is_holiday: !!holidayName,
                holiday_name: holidayName,
                solar_term: solarTerm,
                lunar_day_name: lunarDay,
                lunar_month_name: lunarMonth
            });
        }

        // 下月
        const remaining = 42 - allDays.length;
        for (let i = 1; i <= remaining; i++) {
            allDays.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                currentMonth: false,
                is_weekend: false,
                is_holiday: false,
                holiday_name: null,
                solar_term: null,
                lunar_day_name: '',
                lunar_month_name: ''
            });
        }

        return new Response(JSON.stringify({
            success: true,
            year,
            month,
            days: allDays
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
