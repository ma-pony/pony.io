---
title: '常见 SQL 语法'
date: '2023-04-29'
tags: ['mysql']
draft: false
summary: '记录常见 SQL 语法示例，包括 `ROW_NUMBER()` 等窗口函数。'
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
