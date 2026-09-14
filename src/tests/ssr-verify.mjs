async function verify() {
  const PORT = process.env.PORT || 3003;
  const BASE = `http://127.0.0.1:${PORT}`;
  const tests = [
    { url: `${BASE}/`, expectStatus: 200, label: 'Main Root' },
    { url: `${BASE}/hub`, expectStatus: 200, label: 'Crawler Hub' },
    { url: `${BASE}/robots.txt`, expectStatus: 200, label: 'Robots.txt' },
    { url: `${BASE}/sitemap.xml`, expectStatus: 200, label: 'Sitemap Index (2 Child Sitemaps)' },
    { url: `${BASE}/sitemaps/core.xml`, expectStatus: 200, label: 'Core Sitemap (2 URLs)' },
    { url: `${BASE}/sitemaps/waste-gyeonggi-001.xml`, expectStatus: 200, label: 'Waste Gyeonggi Child Sitemap (840 URLs)' },
    { url: `${BASE}/sitemaps/waste-gyeonggi-999.xml`, expectStatus: 404, label: 'Invalid Child Sitemap (404)' },

    // STEP 3-B2 Independent Legal Dong Verification
    { url: `${BASE}/?k=` + encodeURIComponent('율전동-폐기물처리업체'), expectStatus: 200, label: 'LEGAL DONG: 율전동-폐기물처리업체' },
    { url: `${BASE}/?k=` + encodeURIComponent('고색동-가구수거'), expectStatus: 200, label: 'LEGAL DONG: 고색동-가구수거' },
    { url: `${BASE}/?k=` + encodeURIComponent('오목천동-이사폐기물처리'), expectStatus: 200, label: 'LEGAL DONG: 오목천동-이사폐기물처리' },
    { url: `${BASE}/?k=` + encodeURIComponent('곡반정동-폐기물처리비용'), expectStatus: 200, label: 'LEGAL DONG: 곡반정동-폐기물처리비용' },
    { url: `${BASE}/?k=` + encodeURIComponent('이의동-폐기물수거업체'), expectStatus: 200, label: 'LEGAL DONG: 이의동-폐기물수거업체' },

    // STEP 3-B2 Nationwide Collision Resolution Verification
    { url: `${BASE}/?k=` + encodeURIComponent('수원시-정자동-폐기물처리업체'), expectStatus: 200, label: 'COLLISION RESOLVED: 수원시-정자동-폐기물처리업체' },
    { url: `${BASE}/?k=` + encodeURIComponent('수원시-금곡동-폐기물처리비용'), expectStatus: 200, label: 'COLLISION RESOLVED: 수원시-금곡동-폐기물처리비용' },
    { url: `${BASE}/?k=` + encodeURIComponent('수원시-조원동-가구수거'), expectStatus: 200, label: 'COLLISION RESOLVED: 수원시-조원동-가구수거' },

    // STEP 3-B2 404 Rules (Numbered Dong & Collision Solo without prefix)
    { url: `${BASE}/?k=` + encodeURIComponent('정자1동-폐기물처리업체'), expectStatus: 404, label: 'NUMBERED DONG ALIAS: 정자1동-폐기물처리업체 (404)' },
    { url: `${BASE}/?k=` + encodeURIComponent('매탄3동-폐기물처리업체'), expectStatus: 404, label: 'NUMBERED DONG ALIAS: 매탄3동-폐기물처리업체 (404)' },
    { url: `${BASE}/?k=` + encodeURIComponent('정자동-폐기물처리업체'), expectStatus: 404, label: 'UNPREFIXED COLLISION: 정자동-폐기물처리업체 (404)' },
    { url: `${BASE}/?k=` + encodeURIComponent('금곡동-폐기물처리업체'), expectStatus: 404, label: 'UNPREFIXED COLLISION: 금곡동-폐기물처리업체 (404)' },
    { url: `${BASE}/?k=` + encodeURIComponent('없는지역-폐기물처리'), expectStatus: 404, label: 'INVALID REGION (404)' },
  ];

  for (const t of tests) {
    const res = await fetch(t.url);
    const html = await res.text();
    console.log(`\n=== ${t.label} ===`);
    console.log(`HTTP Status: ${res.status} (Expected: ${t.expectStatus}) -> ${res.status === t.expectStatus ? 'PASS' : 'FAIL'}`);

    if (res.status === 200 && t.url.includes('?k=')) {
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || 'NOT FOUND';
      const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || 'NOT FOUND';
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || 'NOT FOUND';
      const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || 'NOT FOUND';
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'NOT FOUND';

      const hasInternalLinkSection = html.includes('연관 서비스 및 인접 지역 안내');
      const anchorLinks = Array.from(html.matchAll(/<a[^>]+href="(\/\?k=[^"]+)"[^>]*>([\s\S]*?)<\/a>/g))
        .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));

      console.log(`H1: ${h1}`);
      console.log(`Title: ${title}`);
      console.log(`Canonical: ${canonical}`);
      console.log(`Robots: ${robots}`);
      console.log(`Internal Links Section Present: ${hasInternalLinkSection ? 'YES' : 'NO'}`);
      console.log(`Internal Links Count: ${anchorLinks.length}`);
      if (anchorLinks.length > 0) {
        console.log(`Sample Internal Link: ${anchorLinks[0].text} -> ${anchorLinks[0].href}`);
      }
    } else if (res.status === 200 && t.url.endsWith('/hub')) {
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'NOT FOUND';
      const hubAnchors = Array.from(html.matchAll(/<a[^>]+href="(\/\?k=[^"]+)"/g)).map(m => m[1]);
      console.log(`Hub H1: ${h1}`);
      console.log(`Hub Dynamic Route Anchors Count: ${hubAnchors.length}`);
    } else if (res.status === 200 && t.url.endsWith('/sitemap.xml')) {
      const sitemapCount = (html.match(/<sitemap>/g) || []).length;
      const isIndex = html.includes('<sitemapindex');
      console.log(`Root is <sitemapindex>: ${isIndex ? 'YES' : 'NO'} -> ${isIndex ? 'PASS' : 'FAIL'}`);
      console.log(`Sitemap Index Child Count: ${sitemapCount} (Expected: 2) -> ${sitemapCount === 2 ? 'PASS' : 'FAIL'}`);
    } else if (res.status === 200 && t.url.endsWith('/sitemaps/core.xml')) {
      const urlCount = (html.match(/<url>/g) || []).length;
      const isUrlSet = html.includes('<urlset');
      console.log(`Core is <urlset>: ${isUrlSet ? 'YES' : 'NO'} -> ${isUrlSet ? 'PASS' : 'FAIL'}`);
      console.log(`Core URL Count: ${urlCount} (Expected: 2) -> ${urlCount === 2 ? 'PASS' : 'FAIL'}`);
    } else if (res.status === 200 && t.url.endsWith('/sitemaps/waste-gyeonggi-001.xml')) {
      const urlCount = (html.match(/<url>/g) || []).length;
      const isUrlSet = html.includes('<urlset');
      console.log(`Waste Child is <urlset>: ${isUrlSet ? 'YES' : 'NO'} -> ${isUrlSet ? 'PASS' : 'FAIL'}`);
      console.log(`Waste Gyeonggi URL Count: ${urlCount} (Expected: 840) -> ${urlCount === 840 ? 'PASS' : 'FAIL'}`);
    }
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
