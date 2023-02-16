二分查找是在一个有序列表中查找数据

使用三个位置变量来记录特殊位置
bottom记录最小位置，up记录最大位置，pos记录中间位置
每次按照pos分成两半，然后定位所在的那一半，继续细分，直到找到或者up的位置小于bottom的位置即没找到为止

二分查找的效率是log2n

```python
bottom = 0
up = len(words) - 1
pos = (bottom + up) // 2
found = False

while up >= bottom:
    if words[pos] == word:
        found =True
        break
    elif words[pos] > word:
        up = pos - 1
        pos = (bottom + up) // 2
    else:
        buttom = pos + 1
        pos = (bottom + up) // 2
if found:
    print(pos)
else:
    print(-1)

```

