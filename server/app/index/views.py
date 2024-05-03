from . import index
from flask import jsonify
from app.mongo import mongo
from bson.json_util import dumps
import requests
import nltk
# NLTK库
from nltk.tokenize import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk.corpus import brown
from nltk.sentiment.vader import SentimentIntensityAnalyzer
# 创建情感分析器
sid = SentimentIntensityAnalyzer()
# snownlp
import snownlp
# from pymongo import UpdateOne


proxies = { "http": None, "https": None}
@index.route('/banner', methods=['GET'])
def index_banner():
  response = requests.get('http://codercba.com:9002/banner',proxies=proxies)
  result = response.text
  return result

@index.route('/newSongs', methods=['GET'])
def index_newSongs():
  response = requests.get('http://codercba.com:9002/top/song?type=7',proxies=proxies)
  result = response.text
  return result


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
      # # 构建更新请求
      # update_request = UpdateOne({'id': song_id}, {'$set': {'score': final_score}}, upsert=True)
      # bulk_updates.append(update_request)

      # # 批量执行更新请求
      # if bulk_updates:
      #     mongo.db.songs.bulk_write(bulk_updates)

  return jsonify({'comment_scores': all_comment_scores})