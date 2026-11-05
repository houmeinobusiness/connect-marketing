import json
from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path(__file__).resolve().parent
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width in [320,390,768,1440]:
        page=browser.new_page(viewport={'width':width,'height':900}, device_scale_factor=1)
        page.route('**/*', lambda route: route.continue_() if route.request.url.startswith('http://127.0.0.1:4321') else route.abort())
        page.goto('http://127.0.0.1:4321/',wait_until='networkidle')
        assert page.locator('h1').count()==1
        assert page.locator('.consultation-example').count()==3
        assert page.locator('#faq details').count()==6
        for item in page.locator('#faq summary').all():
            item.click()
        assert page.locator('#faq details[open]').count()==6
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
        assert page.locator('a[href="https://tally.so/r/EqkyYX"]').count()==1
        assert page.locator('footer a[href="https://x.com/houmeinobiz"]').count()==1
        graph=json.loads(page.locator('script[type="application/ld+json"]').text_content())['@graph']
        assert [x['@type'] for x in graph]==['Organization','WebSite']
        page.locator('#consultations a[href="#contact"]').click()
        assert page.url.endswith('#contact')
        page.locator('#consultations').screenshot(path=str(out/f'consultations-{width}.png'), style='.header,.skip-link{visibility:hidden!important}')
        page.locator('footer').screenshot(path=str(out/f'footer-{width}.png'))
        page.goto('http://127.0.0.1:4321/privacy/')
        assert page.locator('h1').count()==1
        assert page.locator('script[type="application/ld+json"]').count()==0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        results.append({'width':width,'horizontalOverflow':False,'faqOpen':6,'contactAnchor':True,'tallyFallback':True,'structuredData':True,'privacy':True})
        page.close()
    page=browser.new_page(java_script_enabled=False)
    page.goto('http://127.0.0.1:4321/')
    page.locator('#faq summary').first.click()
    assert page.locator('#faq details[open]').count()==1
    assert page.locator('#consultations').is_visible()
    browser.close()
(out/'browser-results.json').write_text(json.dumps({'externalRequests':'blocked; no form submission','javascriptDisabledCheck':'passed','viewports':results},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results))
