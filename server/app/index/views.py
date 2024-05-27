from . import index
from bson import json_util 
from flask import request
from flask import jsonify
from app.mongo import mongo
from bson.json_util import dumps
from random import sample, randint, shuffle
from flask import Flask, Response, request, jsonify
import random
import requests
import re
# # NLTK库
# from nltk.tokenize import sent_tokenize
# from nltk.tokenize import word_tokenize
# from nltk.corpus import brown
# from nltk.sentiment.vader import SentimentIntensityAnalyzer
# # 创建情感分析器
# sid = SentimentIntensityAnalyzer()
# snownlp
import snownlp
from pymongo import UpdateOne
from operator import itemgetter

# 协同过滤
import pandas as pd
import numpy as np

proxies = { "http": None, "https": None}
@index.route('/banner', methods=['GET'])
def index_banner():
  response = requests.get('http://codercba.com:9002/banner',proxies=proxies)
  result = response.text
  return result

@index.route('/song/detail', methods=['GET'])
def index_detail():
  ids = request.args.get('ids')
  response = requests.get(f'http://codercba.com:9002/song/detail?ids={ids}', proxies=proxies)
  result = response.text
  return result

@index.route('/lyric', methods=['GET'])
def index_lyric():
  id = request.args.get('id')
  response = requests.get(f'http://127.0.0.1:3000/lyric?id={id}',proxies=proxies)
  result = response.text
  return result

@index.route('/simSong', methods=['GET'])
def index_simSong():
  id = request.args.get('id')
  response = requests.get(f'http://127.0.0.1:3000/simi/song?id={id}',proxies=proxies)
  result = response.text
  return result

@index.route('/newSongs', methods=['GET'])
def index_newSongs():
  response = requests.get('http://codercba.com:9002/top/song?type=7',proxies=proxies)
  result = response.text
  return result

@index.route('/getSongs', methods=['GET'])
def index_getSongs():
    songs_content = list(mongo.db.songs.find()) 

    return json_util.dumps(songs_content)
@index.route('/getMyLike', methods=['GET'])
def index_getMyLike():
    songs_content = list(mongo.db.songs.find({"like": 1})) 

    return json_util.dumps(songs_content)
@index.route('/updateLike', methods=['GET'])
def index_updateLike():
    id = request.args.get('id')
    like = request.args.get('like')

    result = mongo.db.songs.update_one({"id": int(id)}, {"$set": {"like": int(like)}})
    return jsonify({"updated": result.modified_count > 0})
@index.route('/getContent', methods=['GET']) 
def index_getContent(): 
    id = request.args.get('id') 
    idx = int(id) 
    songs_content = list(mongo.db.contents.find({'id': idx})) 
    return json_util.dumps(songs_content)

@index.route('/highScore', methods=['GET'])
def index_high_score():
    # 获取所有歌曲数据
    songs_data = list(mongo.db.songs.find())

    # 存储所有更新请求
    bulk_updates = []

    # 检查每个歌曲数据是否有 'score' 字段，并对没有的数据添加 'score' 字段
    for song in songs_data:
        if 'score' not in song:
            # 构建更新请求
            update_request = UpdateOne({'_id': song['_id']}, {'$set': {'score': 5.0}}, upsert=False)
            bulk_updates.append(update_request)

    # 批量执行更新请求
    if bulk_updates:
        mongo.db.songs.bulk_write(bulk_updates)

    # 对歌曲数据按情感得分进行排序
    sorted_songs = sorted(songs_data, key=lambda x: x.get('score', 0), reverse=True)

    # 选择前20项得分最高的歌曲
    top_20_songs = sorted_songs[:20]

    # 将 ObjectId 转换为字符串
    for song in top_20_songs:
        song['_id'] = str(song['_id'])

    return jsonify({'data': top_20_songs})

# 情感分析得分
@index.route('/score', methods=['GET'])
def index_score():
  # 情感分析
  # compound表示复杂程度, neu表示中性, neg表示负面情绪, pos表示正面情绪

  # 查询数据库中的所有歌曲数据
  songs_data = list(mongo.db.songs.find())
  
  # 如果查询结果为空，返回空列表
  if not songs_data:
      return jsonify([])

  # 存储所有评论的情感得分和评论内容
  all_comment_scores = []
  # 存储所有更新请求
  bulk_updates = []
  # 遍历每个歌曲数据
  for song_data in songs_data:
      # 获取当前歌曲的ID
      song_id = song_data['id']

      # 查询当前歌曲的所有评论
      songs_content = mongo.db.contents.find({'id': song_id})
      xxx = []
      # 提取每个评论数据项的评论内容字段，并进行情感分析
      for comment in songs_content:
          comment_text = comment['content']
          try:
            # 可能引发异常的代码段
            sentiment_score = snownlp.SnowNLP(comment_text).sentiments
          except Exception as e:
              print("An error occurred:", e)
              sentiment_score = 5.0
          # 将评论内容和情感得分存储到列表中
          xxx.append({'comment': comment_text, 'score': sentiment_score})
      # 计算所有评论的情感得分总和
      total_score = sum(comment['score'] for comment in xxx)

      # 计算评论的数量
      num_comments = len(xxx)
      # 如果评论数量为零，则不进行平均情感得分的计算
      if num_comments == 0:
          continue
      # 计算平均情感得分并保留一位小数
      average_score = round(total_score / num_comments, 2)
      # 将平均情感得分转换为满分为10的得分并保留一位小数
      final_score = round(average_score * 10, 2)
      print(final_score)
      all_comment_scores.append({'score': final_score, 'id': song_id})
      # 构建更新请求
      update_request = UpdateOne({'id': song_id}, {'$set': {'score': final_score}}, upsert=True)
      bulk_updates.append(update_request)

      # 批量执行更新请求
      if bulk_updates:
          mongo.db.songs.bulk_write(bulk_updates)

  return jsonify({'comment_scores': all_comment_scores})

# 重新计算比例
@index.route('/cooperate', methods=['GET'])
def index_addData():
    # 查询数据库中的所有歌曲数据
    songs_data = list(mongo.db.songs.find({'like': 1}))
    total_songs_with_like = len(songs_data)
    print(f"共有 {total_songs_with_like} 条数据的like字段为1。")
    # 歌手量
    author_counts = {}
    for song in songs_data:
        author = song.get('article')
        id = song.get('id')
        if author in author_counts:
            author_counts[author]['count'] += 1
        else:
            author_counts[author] = {'name': author, 'id': id, 'count': 1}
    # 计算每个作者的歌曲占比，并保留两位小数
    for author_info in author_counts.values():
        author_info['percentage'] = round(author_info['count'] / total_songs_with_like, 4)

    # 将字典转换为列表，并按count降序排列
    result = sorted(author_counts.values(), key=lambda x: x['count'], reverse=True)
    top_five = result[:5]  # 取前五项

    # 计算前五项的percentage之和
    total_percentage = sum(item['percentage'] for item in top_five)

    # 重新计算每项的百分比，并更新到字典中
    for item in top_five:
        item['percentage'] = round(item['percentage'] / total_percentage, 4)
    update_data = {
        "name" : 'root',
        "author_info" : top_five
    }
    # 检查是否存在name为'root'的文档
    existing_document = mongo.db.cooperate.find_one({"name": "root"})
    
    if existing_document is None:
        # 如果不存在，则插入
        mongo.db.cooperate.insert_one(update_data)
    mongo.db.cooperate.update_one({'name': 'root'}, {'$set': update_data})

    # return jsonify(result)
    
    # 风格量
    type_counts = {}
    for song in songs_data:
        type = song.get('type')
        id = song.get('id')
        if type in type_counts:
            type_counts[type]['count'] += 1
        else:
            type_counts[type] = {'type': type, 'id': id, 'count': 1}

    for type_info in type_counts.values():
        type_info['percentage'] = round(type_info['count'] / total_songs_with_like, 2)
    # 将字典转换为列表，并按count降序排列
    result = sorted(type_counts.values(), key=lambda x: x['count'], reverse=True)
    top_five = result[:5]  # 取前五项

    # 计算前五项的percentage之和
    total_percentage = sum(item['percentage'] for item in top_five)
     # 重新计算每项的百分比，并更新到字典中
    for item in top_five:
        item['percentage'] = round(item['percentage'] / total_percentage, 4)

    update_data = {
        "type_info" : top_five
    }
    mongo.db.cooperate.update_one({'name': 'root'}, {'$set': update_data})
    # return jsonify(result)

    # 发布时间的年代统计
    decade_counts = {}

    for song in songs_data:
        publishTime = song.get('publishTime')
        if publishTime:
            decade = convert_to_decade(publishTime)
            # 然后继续原来的计数逻辑...
        else:
            print(f"警告: 歌曲缺少publishTime信息.")
        # 使用 convert_to_decade 函数转换发布时间到几十年代
        decade = convert_to_decade(song.get('publishTime'))
        if decade in decade_counts:
            decade_counts[decade]['count'] += 1
        else:
            decade_counts[decade] = {'decade': decade, 'count': 1}
    for decade_info in decade_counts.values():
        decade_info['percentage'] = round(decade_info['count'] / total_songs_with_like, 2)
    # 将字典转换为列表，并按count降序排列
    result = sorted(decade_counts.values(), key=lambda x: x['count'], reverse=True)
    top_five = result[:5]  # 取前五项

    # 计算前五项的percentage之和
    total_percentage = sum(item['percentage'] for item in top_five)
     # 重新计算每项的百分比，并更新到字典中
    for item in top_five:
        item['percentage'] = round(item['percentage'] / total_percentage, 4)

    update_data = {
        "decade_info" : top_five
    }
    mongo.db.cooperate.update_one({'name': 'root'}, {'$set': update_data})
    return jsonify(result)



# 年代计算
def convert_to_decade(date_str):
    if not isinstance(date_str, str) or "年" not in date_str:
        return "未知年代"  # 或者处理错误的逻辑，比如抛出异常或返回None
    year_match = re.search(r'(\d{4})年', date_str)
    if year_match:
        year = int(year_match.group(1))
        decade = str(int(year / 10) * 10) + "年代"
        return decade
    else:
        return "无法识别的日期格式"

# 计算每首歌的权重得分
@index.route('/compute', methods=['GET'])
def index_compute():
    cooperate_raw = [0.3, 0.2, 0.1, 0.4]
    cooperate_data = list(mongo.db.cooperate.find({'name': 'root'}))[0]
    songs_data = list(mongo.db.songs.find())

    decade_info = cooperate_data.get('decade_info', [])
    author_info = cooperate_data.get('author_info', [])
    type_info = cooperate_data.get('type_info', [])
    def find_match_in_array(array, key, value):
        """在数组中查找匹配给定键值对的项"""
        return next((item for item in array if item.get(key) == value), None)
    for song in songs_data:
        id = song.get('id')
        score = song.get('score')
        article = song.get('article', '无')
        song_type = song.get('type', '无')
        publish_time = song.get('publishTime', '无')
        print('article', article)
        print('song_type', song_type)
        print('publish_time', publish_time)
        
        # 假设每个cooperate_data文档中author_info, type_info, decade_info是包含字典的数组
        matched_article = None
        matched_type = None
        matched_decade = None
        
        article_bite = 0
        type_bite = 0
        decade_bite = 0

        if isinstance(author_info, list):
            matched_article = find_match_in_array(author_info, 'name', article)
            if matched_article:
                article_bite = matched_article.get('percentage', 0)
                # break  # 找到匹配后退出循环
        else:
            print("Warning: 'author_info' is not a list in a document.")
        
        if isinstance(type_info, list):
            matched_type = find_match_in_array(type_info, 'type', song_type)
            if matched_type:
                type_bite = matched_type.get('percentage', 0)
                # break  # 找到匹配后退出循环
        else:
            print("Warning: 'type_info' is not a list in a document.")
        
        if isinstance(decade_info, list):
            matched_decade = find_match_in_array(decade_info, 'decade', convert_to_decade(publish_time))
            if matched_decade:
                decade_bite = matched_decade.get('percentage', 0)
                # break  # 找到匹配后退出循环
        else:
            print("Warning: 'decade_info' is not a list in a document.")
        
        print('1', article_bite)
        print('2',type_bite)
        print('3',decade_bite)

        result = article_bite * cooperate_raw[0] + type_bite * cooperate_raw[1] + decade_bite * cooperate_raw[2] + (score/10) * cooperate_raw[3] 
        # 保留五位小数
        result_rounded = round(result, 5)
        # 转换成百分比并四舍五入到整数
        percentage = result_rounded * 100

        mongo.db.songs.update_one({'id': id}, {'$set': { "cooperate_score": percentage}})
    return '1'

# 获取协同过滤后的数据（推荐算法）
@index.route('/getCooperateSongs', methods=['GET'])
def index_getCooperateSongs():
    cooperate_data = list(mongo.db.songs.find({'like': 1}).sort('cooperate_score', -1))
    # 将ObjectId转换为字符串
    for doc in cooperate_data:
        doc['_id'] = str(doc['_id'])  # 将ObjectId转换为字符串
    
    # 将处理后的查询结果转换为JSON并返回
    return jsonify(cooperate_data), 200

# 给每一条评论添加情感分析
@index.route('/addScore', methods=['GET'])
def index_addScore():
    content_data = mongo.db.contents.find(
        {"score": {"$exists": False}},
        {'_id': 1, 'content': 1}  # 只查询_id和content字段以加快速度
    )
    # 如果查询结果为空，返回空列表
    if not content_data:
        return jsonify([])

    # 存储所有评论的情感得分和评论内容
    all_comment_scores = []
    # 存储所有更新请求
    bulk_updates = []
    # 遍历每个歌曲数据
    for content in content_data:
        # 获取当前歌曲的ID
        content_id = content['_id']

        comment_text = content['content']
        try:
            # 可能引发异常的代码段
            sentiment_score = snownlp.SnowNLP(comment_text).sentiments
        except Exception as e:
            print("An error occurred:", e)
            sentiment_score = 5.0
        print(content_id, sentiment_score)
        # 构建更新请求
        update_request = UpdateOne({'_id': content_id}, {'$set': {'score': sentiment_score}}, upsert=True)
        bulk_updates.append(update_request)
        if len(bulk_updates) >= 1000:
            mongo.db.contents.bulk_write(bulk_updates)
            bulk_updates = []  # 清空列表准备下一批次的更新
        # 批量执行更新请求
        if bulk_updates:
            mongo.db.contents.bulk_write(bulk_updates)

    return jsonify({'comment_scores': all_comment_scores})

# 查询所有歌手
@index.route('/search/singer', methods=['GET'])
def index_searchSinger():
    # 使用聚合管道统计不同的article（歌手）数量
    artist_count = mongo.db.songs.aggregate([
        {"$group": {"_id": "$article", "count": {"$sum": 1}}},
        {"$group": {"_id": None, "total_artists": {"$sum": 1}}}
    ])
    return '1'
# 新用户协同过滤算法
@index.route('/newPeopleComputed', methods=['GET'])
def index_search():
    articles = request.args.get('article', '').split(',')
    # 确保数组不为空
    articles = [article.strip() for article in articles if article.strip()]
    types = request.args.get('type', '').split(',')
    publishTimes = request.args.get('year', '').split(',')

    # 清理并过滤掉空白字符串
    types = [t.strip() for t in types if t.strip()]
    publishTimes = [pt.strip() for pt in publishTimes if pt.strip()]
    # 歌手 风格 年代
    cooperate_scores = {
        'type': 0.3,
        'article': 0.4,
        'year': 0.3
    }

    songs_data = list(mongo.db.songs.find())
    for song in songs_data:
        new_people_score = 0
        if 'article' in song and any(song_article == song['article'] for song_article in articles):
            new_people_score += cooperate_scores['article']
        # 检查类型是否匹配
        if 'type' in song and any(song_type == song['type'] for song_type in types):
            new_people_score += cooperate_scores['type']
        
        # 检查年份是否匹配
        song_decade = convert_to_decade(song.get('publishTime', ''))
        if 'publishTime' in song and any(song_decade == str(pt) for pt in publishTimes):
            new_people_score += cooperate_scores['year']
        
        # 将计算出的得分添加到文档
        song['new_people_score'] = new_people_score

    # 返回包含新字段的数据列表
    songs_data_sorted = sorted(songs_data, key=lambda x: x.get('new_people_score', 0), reverse=True)[:15]
    return json_util.dumps(songs_data_sorted)
# 忘了是啥
@index.route('/xxx', methods=['GET'])
def index_xxx():
    cooperate_data = list(mongo.db.cooperate.find())

    # 初始化矩阵
    author_matrix = []
    type_matrix = []
    decade_matrix = []

    songs_similarity = []
    # 遍历查询结果中的每个文档
    for data in cooperate_data:
        # 直接提取百分比值，假设每个条目是包含"percentage"键的对象列表
        # 注意：这里直接从data中获取'author_info'等，因为在循环中data是单个文档
        try:
            author_percentage = [entry.get('percentage', 0) for entry in (data.get('author_info', [])[:5] or [])]
            type_percentage = [entry.get('percentage', 0) for entry in (data.get('type_info', [])[:5] or [])]
            decade_percentage = [entry.get('percentage', 0) for entry in (data.get('decade_info', [])[:5] or [])]

            # 补齐至5个元素，不足则用0填充
            author_percentage += [0] * (5 - len(author_percentage))
            type_percentage += [0] * (5 - len(type_percentage))
            decade_percentage += [0] * (5 - len(decade_percentage))

            # 合并三个维度的相似度为单个列表，代表一首歌曲的整体相似度信息
            song_similarity = author_percentage + type_percentage + decade_percentage
            # 添加到列表中，每个列表代表一首歌曲
            songs_similarity.append(song_similarity)
        except TypeError:
            continue

    # 相同的权重比例，这里需要调整为与合并后的维度相匹配的形状
    weights = np.array([0.3, 0.3, 0.4] * 5)  # 因为每种维度有5个值，权重重复5次

    # 获取所有歌曲进行过滤算出结果
    songs_data = list(mongo.db.cooperate.find())
    
    # # 将列表转换为NumPy数组以便计算
    # songs_similarity_np = np.array(songs_similarity)

    # # 计算每首歌曲的加权相似度，这里直接相乘应该没问题了，因为我们不再需要指定axis
    # weighted_similarities = np.sum(songs_similarity_np * weights, axis=1)

    # print("每首歌曲的加权后相似度得分：", weighted_similarities)
    
    # # 注意：这里省略了返回部分的展示，因为返回部分与问题无关且未改变
    # 返回处理后的矩阵数据
    return {
        "author_matrix": author_matrix,
        "type_matrix": type_matrix,
        "decade_matrix": decade_matrix
    }