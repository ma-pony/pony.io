## in 条件查询
```shell
SELECT * FROM users WHERE name NOT IN ("A", "B", "C")
```
name 为None的数据不会出现在结果中，None要单独判断，某些时候是希望这个filter也把None的数据也筛选出来
