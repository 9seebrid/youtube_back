import os
import sys
from youtube_search import YoutubeSearch  # YouTube 검색 라이브러리
import json

def search_songs(artist_name):
    try:
        results = YoutubeSearch(artist_name + " songs", max_results=10).to_dict()
        songs = []
        for result in results:
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
    print(json.dumps(search_songs(artist_name)))
