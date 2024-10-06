import os
import sys
from youtube_search import YoutubeSearch  # YouTube 검색 라이브러리
import json

def search_songs(artist_name, page=1):
    try:
        results_per_page = 10  # 페이지당 10개의 결과
        start_index = (page - 1) * results_per_page
        results = YoutubeSearch(artist_name + " songs", max_results=50).to_dict()  # 총 50개의 검색 결과 받아옴

        paginated_results = results[start_index:start_index + results_per_page]

        songs = []
        for result in paginated_results:
            songs.append({
                'title': result['title'],
                'views': result['views'],
                'url': 'https://www.youtube.com' + result['url_suffix'],
            })
        return songs
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    artist_name = sys.argv[1]
    page = int(sys.argv[2]) if len(sys.argv) > 2 else 1  # 페이지 번호 받기, 기본값은 1
    print(json.dumps(search_songs(artist_name, page)))
