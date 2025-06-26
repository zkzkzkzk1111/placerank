import urllib.parse
import re
import time
import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dbconfig import insert_rank_result

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
def extract_valid_place_links(driver):
    all_links = driver.find_elements(By.TAG_NAME, "a")
    valid_links = []
    seen_ids = set()

    for link in all_links:
        try:
            href = link.get_attribute("href")
            if not href or "place.naver.com" not in href:
                continue
            if any(exclude in href for exclude in ["/list?", "/my", "tivan.naver.com", "/photo?", "/review/", "/menu/", "/home/"]):
                continue

            # 수정된 정규표현식
            match = re.search(r'/place/(\d+)(?:[/?]|$)', href)
            if match:
                place_id = match.group(1)
                if place_id not in seen_ids:
                    seen_ids.add(place_id)
                    valid_links.append(href)
        except:
            continue
    return valid_links

def get_rank(search_query, place_id):
    driver = None

    rank = -1
    traffic_in_kb = 0.0

    try:

        chromedriver_autoinstaller.install()

        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-software-rasterizer")
        chrome_options.add_argument("--ignore-gpu-blacklist")
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15")

        driver = webdriver.Chrome(options=chrome_options)

        encoded_query = urllib.parse.quote(search_query)
        search_url = f"https://m.place.naver.com/place/list?query={encoded_query}&level=top&sortingOrder=precision"
        driver.get(search_url)
        time.sleep(3)
        print(search_url)

        for _ in range(5):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            links = extract_valid_place_links(driver)

            for idx, link in enumerate(links):
                if f"/{place_id}?" in link or f"/{place_id}/" in link:
                    rank = idx + 1
                    break

            if rank != -1:
                break


        try:
            total_traffic_bytes = driver.execute_script(
                "return window.performance.getEntries().reduce((acc, entry) => acc + (entry.transferSize || 0), 0);"
            )
            traffic_in_kb = total_traffic_bytes / 1024
            print(f"크롤링 완료. 총 발생 트래픽: {traffic_in_kb:.2f} KB")
        except Exception as e:
            print(f"트래픽 측정 중 오류 발생: {e}")


        return rank, traffic_in_kb

    except Exception as e:
        print(f'예외 발생: {e}')

        return rank, traffic_in_kb
    finally:

        if driver:
            driver.quit()

@app.route('/api/rank', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_place_rank():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "JSON 데이터가 필요합니다."}), 400

        search_query = data.get('search_query')
        place_id = data.get('place_id')

        if not search_query or not place_id:
            return jsonify({"error": "search_query와 place_id는 필수입니다."}), 400

        print(f"순위 조회 - 검색어: '{search_query}', 장소ID: '{place_id}'")

        rank, traffic_in_kb = get_rank(search_query, place_id)

        rounded_traffic = round(traffic_in_kb, 2)

        # 반올림된 값을 사용하여 DB에 저장합니다.
        db_success = insert_rank_result(
            search_query=search_query,
            place_id=place_id,
            rank_position=rank,
            traffic=rounded_traffic,
        )

        return jsonify({
            "rank": rank,
            "search_query": search_query,
            "place_id": place_id,
            "traffic": rounded_traffic,
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)