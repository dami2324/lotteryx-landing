import urllib.request
import re
import ssl
from bs4 import BeautifulSoup
import os

def download_lottery_images():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = "https://html.duckduckgo.com/html/?q=billetes+loteria+nacional+de+panama"
    req = urllib.request.Request(
        url, 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    )

    print("Fetching search results...")
    try:
        response = urllib.request.urlopen(req, context=ctx)
        html = response.read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        # In duckduckgo html, image results might not be directly visible or we might just get articles.
        # Let's search specifically for images by looking for <img> tags in the results
        # Actually, standard duckduckgo html doesn't have image search easily accessible.
        pass
    except Exception as e:
        print(e)

if __name__ == "__main__":
    download_lottery_images()
