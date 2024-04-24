import json

import pandas as pd
import requests
from bs4 import BeautifulSoup


def get_page1():
    """Get page and save"""
    url = "https://letztegeneration.org/presse/pressemitteilungen/"
    res = requests.get(url)
    if res.status_code == 200:
        with open("data/seite1_current.html", "w", encoding="utf-8") as file:
            file.write(res.text)
    else:
        print("Failed to fetch HTML content")


def read_html():
    """Open and load html file"""

    with open("data/seite1_current.html", "r", encoding="utf-8") as file:
        html_content = file.read()

    return html_content


def get_texts_1(html_content):
    """Extract press releases from page"""
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
        response = requests.get(url)
        if response.status_code == 200:
            page_soup = BeautifulSoup(response.content, "html.parser")
            content = page_soup.get_text("\n", strip=True).strip()
        else:
            print(f"Failed to fetch content for URL: {url}")
            content = None

        # wrap in JSON
        responses[i] = {"title": title, "date": date, "url": url, "content": content}

    return responses


def wrangle_responses(responses):
    """Convert responses to DataFrame and wrangle"""
    df = pd.DataFrame(responses).T

    # FIXME: date to DateTime (with ChatGPT?)
    # FIXME: clean texts

    return df


if __name__ == "__main__":
    ## get current page and save
    get_page1()
    html = read_html()
    texts = get_texts_1(html)

    with open("data/responses_current.json", "w") as f:
        json.dump(texts, f, indent=2)

    df = wrangle_responses(texts)
