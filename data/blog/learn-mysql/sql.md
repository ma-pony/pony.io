---
title: # TODO
// title 必须是英文
subtitle: # TODO
slug: sql
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1655797951107/2U0H0d7Bo.jpg?auto=compress
domain: pony.hashnode.dev
ignorePost: true
---


# 常见的SQL

## ROW_NUMBER()
他会将查询出来的每一列数据都加上一个编号，从1开始累加，依次排序
```sql
select ROW_NUMBER() OVER (ORDER BY name)
from TABLE;
```
也可以进行分组排序，每一个会有自己的计数编号，都从1开始
```sql
select ROW_NUMBER() OVER (PARTITION BY name ORDER BY name)
from TABLE;
```

## NOT EXISTS
