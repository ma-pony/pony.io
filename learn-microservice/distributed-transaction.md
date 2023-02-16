---
title: Distributed Transaction
// title 必须是英文
subtitle: 分布式事务简述
slug: distributed-transaction
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1655798263682/bLsWfxBgA.jpg?auto=compress
domain: pony.hashnode.dev
---

分布式事务

# 基础理论
## CAP理论
### CAP
一个系统最多满足其中的两项
#### 一致性(consistency)
分布式系统中，数据一般存在不同节点的副本中当某一个节点中数据更新后，确保其他节点都能读到最新的数据，即为强一致性
#### 可用性(availablility)
当集群一个节点故障后，集群整体还能响应客户端的请求
#### 分区容错性(partition tolerance)
数据如果在一定期限内不能达到一致性，则意味着出现了分区提供分区容忍度的方法就是一个数据项复制到多个节点上

### raft协议(分布式共识算法)
http://www.kailing.pub/raft/index.html

#### 一个节点有三种状态
follower 跟随者
candidate 候选者
leader 领导者
#### 领导人选举(leader election)
所有的节点都从跟随者开始
一定时间内，如果follower没有收到来着leader的心跳响应，他将成为candidate
他将向其他节点发起投票请求，节点以投票作为回复
获得投票最多的候选人将成为领导者
##### 选举超时(election timeout)
跟随者成为候选者之前需要等待的时间
150毫秒与300毫秒之间随机
超时后自动晋升为候选者，并开始任期选举，向其他follow节点发送请求投票信息
如果follow节点还没有投票，则将投票给候选人，同时重置自己的选举超时
一旦候选者获得多数票，将成为领导者
领导者开始向其追随者发送append entries 追加条目信息
这些消息将以心跳时间间隔发送出去，跟随者进行响应
选举任期将持续到跟随者停止接受心跳并成为候选人为止
##### 分裂投票
两个候选者同时获得相同的票数，节点将重新开始选举，所有节点置为follower
#### 日志复制(log replication)
系统所有的更改都要通过领导者
每次更改都将添加到节点日志条目，但当前日志不会提交，不会更改实际值
领导者节点需要将其日志条目复制到跟随者节点，跟随者也不会提交
等待大多数跟随者节点都复制成功，返回响应时，再将其提交
领导者通知跟随者提交记录，并同时返回客户端请求
复制时间与心跳时间相同
面对网络分区时，会有多个leader，当只有一个leader可以将日志复制到多数节点，复制到少数节点的leader只会添加日志，而不会提交当分区修复后，多数节点的leader保留，其他leader退回follower，其日志将被复制到所有节点，分区期间产生的日志将被回滚
## BASE理论
### BASE
#### 基本可用(Basically available)
在出现故障时，允许损失部分的可用性
### 软状态(Soft state)
允许不同节点数据同步之前存在延迟，允许中间状态
### 最终一致性(evetually consistent)
保证系统数据最终达到一致性
### 基于CAP演化而来，核心思想是既然无法做到强一致性，那就做到最终一致性
## ACID规范
ACID
### 原子性(atomicity)
严格遵守
### 一致性(consistency)
事务完成后的一致性严格遵守，事务中的一致性可适当放宽
### 隔离性(isolation)
并行事务不可影响，事务中间结果可见性允许安全放宽
### 持久性(durability)
严格遵守
# 实践
## SAGA事务模式
### 核心思想是将长事务拆分为多个本地短事务，由saga事务协调器协调
### 在SAGA模式中，业务流程中每个参与者都提交本地事务，当出现某一个参与者失败则补偿前面已经成功的参与者，一阶段正向服务和二阶段补偿服务都由业务开发实现
### 分支事务并发执行
### 恢复策略
。。。
## TCC事务模式(Try,Confim,Cancel)
分三个阶段
### Try阶段
尝试执行，完成所有业务检查(一致性)，预留必须业务资源(准隔离性)
### Confirm阶段
如果所有分支的try都成功了，则走到confirm阶段，confirm真正执行业务，不做任何业务检查，只使用try阶段预留的业务资源
### Cancel阶段
如果所有分支的try有一个失败了，则走到cancel阶段，cancel释放try阶段预留的业务资源
。。。
## XA规范
目前主流的数据库基本都支持XA事务
XA规范主要定义了全局事务管理器(TM)和局部资源管理器(RM)之间的接口本地的数据库Mysql在XA中扮演的就是RM角色
### 两个阶段
1. prepare
所有的参与者RM准备执行事务并锁住需要的资源。参与者ready时，向TM报告已准备就绪
2. commit/rollback
当事务管理者确认所有参与者都ready后，向所有参与者发送commit命令
### 事务消息
事务消息提供了支持事务的消息接口，允许使用方把消息发送放到本地的一个事务里，保证事务的原子性
### 工作原理
开启本地事务进行本地数据库修改调用消息事务的prepare接口，预备发送消息提交本地事务调用消息事务的submit接口，触发消息发送
当事务管理器只收到prepare请求，超时未收到submit请求时，调用反查接口canSubmi，询问应用程序，是否能够发送
事务消息与本地消息方案类似，但是将创建本地消息表和轮询本地消息表的操作换成了一个反查接口，提供更加便捷的使用
### 本地消息表
### 最大努力通知
## AT事务模式
### 前提
基于支持本地ACID事务的关系型数据库
JAVA应用，通过JDBC访问数据库
### 机制
一阶段：业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源
二阶段：提交异步化，非常快速完成，回滚通过一阶段的回滚日志进行反向补偿
### 写隔离
一阶段本地事务提交前，需要确保先拿到全局锁
拿不到全局锁，不能提交本地事务
拿全局锁的尝试限定在一定的范围内，超时范围将放弃，并回滚本地事务，释放本地锁
