from time import sleep

import pandas as pd
from bs4 import BeautifulSoup

from media_impact_monitor.util.cache import cache, get


@cache
def extract_press_releases() -> pd.DataFrame:
    """Extract press releases from page"""
    html_content = get("https://letztegeneration.org/presse/pressemitteilungen/").text
    soup = BeautifulSoup(html_content, "html.parser")
    divs = soup.find_all("div", class_="elementor-post__text")

    responses = {}
    for i, div in enumerate(divs):
        url = div.find("a")["href"].strip()
        title = div.find("div", class_="elementor-post__title").text.strip()
        date = div.find("span", class_="elementor-post-date").text.strip()

        # FIXME: date breaker
        # if not "2023" in date:
        #     continue

        print(f"Getting page {i}/{len(divs)}: {url}")
        try:
            response = get(url)
            page_soup = BeautifulSoup(response.content, "html.parser")
            content = page_soup.get_text("\n", strip=True).strip()
        except Exception:
            print(f"Failed to fetch content for URL: {url}")
            content = None

        # wrap in JSON
        responses[i] = {"title": title, "date": date, "url": url, "content": content}
        sleep(1)

    df = pd.DataFrame(responses).T

    # FIXME: date to DateTime (with ChatGPT?)
    # FIXME: clean texts

    return df
