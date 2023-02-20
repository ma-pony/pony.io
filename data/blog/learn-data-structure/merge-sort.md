---
title: # TODO
// title 必须是英文
subtitle: 归并排序
slug: merge-sort
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1654873553830/Lr3zj-rih.jpeg?auto=compress
domain: pony.hashnode.dev
ignorePost: true
---
"""
1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置
3. 比较两个指针所指向的元素，选择相对小的元素放入合并空间，并移动指针到下一个位置
4. 重复步骤3直到某一指针达到序列尾
5. 将另一序列剩下的所有元素直到复制到合并序列尾

"""
