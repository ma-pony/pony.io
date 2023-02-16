---
title: # TODO
// title 必须是英文
subtitle: # TODO
slug: shell
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1655798124955/iHFinBeXp.jpg?auto=compress
domain: pony.hashnode.dev
ignorePost: true
---

## 查看进程
```shell
ps -ef | grep 8080

lsof -i:8080

ps aux | grep rabbitmq

top 
# 查看所有进程

pstree -aup 
# 以树状图的方式展现进程之间的派生关系
```

## 查找git地址
```shell
grep -r 'url.*'  .git/config | sed -r "s/url = (.*)\.git/\1/g"
```

## 打印
-e 转义\n字符,真正换行
```shell
echo -e  'a\nb'
```
