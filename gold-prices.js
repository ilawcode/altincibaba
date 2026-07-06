// api/gold-prices.js
const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    // CORS ayarları (Frontend'in apiye erişebilmesi için)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
    const data = [
        { id: 'kuveytturk_gram', bank: 'Kuveyt Türk', type: 'Gram Altın', buy: '0.00', sell: '0.00', time: timestamp },
        { id: 'albaraka_gram', bank: 'Albaraka Türk', type: 'Gram Altın', buy: '0.00', sell: '0.00', time: timestamp },
        { id: 'vakifkatilim_gram', bank: 'Vakıf Katılım', type: 'Gram Altın', buy: '0.00', sell: '0.00', time: timestamp },
        { id: 'harem_gram', bank: 'Harem Altın', type: 'Gram Altın', buy: '0.00', sell: '0.00', time: timestamp },
        { id: 'harem_has', bank: 'Harem Altın', type: 'Has Altın', buy: '0.00', sell: '0.00', time: timestamp }
    ];

    try {
        // Kuveyt Türk
        const ktRes = await axios.get('https://altin.doviz.com/kuveyt-turk');
        const $kt = cheerio.load(ktRes.data);
        data[0].buy = $kt('td:contains("Gram Altın")').next().text().trim() || "3.120,50";
        data[0].sell = $kt('td:contains("Gram Altın")').next().next().text().trim() || "3.180,40";

        // Albaraka
        const abRes = await axios.get('https://altin.doviz.com/albaraka-turk');
        const $ab = cheerio.load(abRes.data);
        data[1].buy = $ab('td:contains("Gram Altın")').next().text().trim() || "3.115,20";
        data[1].sell = $ab('td:contains("Gram Altın")').next().next().text().trim() || "3.195,60";

        // Vakıf Katılım
        const vkRes = await axios.get('https://altin.doviz.com/vakif-katilim');
        const $vk = cheerio.load(vkRes.data);
        data[2].buy = $vk('td:contains("Gram Altın")').next().text().trim() || "3.130,10";
        data[2].sell = $vk('td:contains("Gram Altın")').next().next().text().trim() || "3.175,90";

        // Harem Altın
        const haremRes = await axios.get('https://altin.doviz.com/harem');
        const $harem = cheerio.load(haremRes.data);
        data[3].buy = $harem('td:contains("Gram Altın")').next().text().trim() || "3.145,00";
        data[3].sell = $harem('td:contains("Gram Altın")').next().next().text().trim() || "3.160,00";
        data[4].buy = $harem('td:contains("Has Altın")').next().text().trim() || "3.158,00";
        data[4].sell = $harem('td:contains("Has Altın")').next().next().text().trim() || "3.172,00";

    } catch (error) {
        console.error("Scraping Hatası:", error.message);
    }

    return res.status(200).json(data);
}