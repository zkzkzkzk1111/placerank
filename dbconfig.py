import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime

# 데이터베이스 설정
DB_CONFIG = {
    'host': 'todaydoc.kr',  # 또는 실제 DB 서버 주소
    'port': 3306,
    'user': 'eztodaydoc',  # 실제 DB 사용자명으로 변경
    'password': 'eztodaydoc123!!',  # 실제 DB 비밀번호로 변경
    'database': 'eztodaydoc',  # 실제 DB 이름으로 변경
}

def get_db_connection():
   
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"데이터베이스 연결 오류: {e}")
        return None


def insert_rank_result(search_query, place_id, rank_position,traffic):
    """순위 검색 결과를 데이터베이스에 저장합니다."""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        insert_query = """
        INSERT INTO rank_results (search_query, place_id, rank_position, traffic)
        VALUES (%s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (search_query, place_id, rank_position,traffic))
        connection.commit()
        
        print(f"순위 결과 저장 완료: {search_query} - {place_id} - {rank_position}위 - {traffic}")
        return True
        
    except Error as e:
        print(f"데이터 삽입 오류: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

 