---
title: http3 & QUIC
// title 必须是英文
subtitle: http3和QUIC分别是什么
slug: http3
tags: http 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1655798015872/68nn5BbTe.jpg?auto=compress
domain: pony.hashnode.dev
---


HTTP/3是第三个版本的HTTP协议，将弃用TPC协议，改用基于UDP协议的QUIC协议

主要是为了解决HTTP/2存在的队头阻塞问题，由于HTTP/2在单个TCP连接上使用了多路复用，受到TCP拥塞控制的影响，
少量的丢包可能导致整个TCP连接上的所有流被阻塞

# QUIC
QUIC(快速UDP网络连接协议)由谷歌开发，
旨在使网页传输更快，提高面向连接的网络应用的性能，在网络层淘汰调TCP，满足应用需求。
它通过使用UDP在两个端点之间创建若干个多路连接来实现这一目的。

QUIC与HTTP2的多路复用连接协同工作，允许多个数据流独立到达所有端点，不受其他数据流的丢包影响。
HTTP2建立在TCP上时，如果任何一个TCP数据包延迟或丢失，所有多路数据流都会受到队头阻塞延迟。

QUIC的次要目标包括降低连接和传输时延


## 减少开销
在连接创建时减少开销，大多数HTTP连接都需要TLS，QUIC是协商密钥和支持的协议成为初始握手过程的一部分。
当客户端打开连接时，服务器响应的数据包包含将来的数据包加密的数据，这消除了TCP上的先连接并通过附加数据包协商安全协议的需要。
其他协议可以以同样的方式进行服务，并将多个步骤组合到一个请求中。


## 不同流之间进行隔离
每个流之间都是单独进行控制的，如果一个流发生错误，协议栈仍可为其他流提供服务，这在提高易出错链路的性能方面非常有用。
在大多数情况下TCP协议通知数据包丢失或损坏之前可能会收到大量的正常数据，但是在纠正错误之前其他的正常请求都会等待甚至重发。
QUIC在修复单个流是任何可以自由处理其他数据

在QUIC级别设置了重传，

## 提高网络切换期间的性能
当设备用户从WIFI热点切换到移动网络时。
如果是TCP，那么每个现有连接会一个接一个超时，然后再重新建立新的连接。
QUIC包含了一个连接标识符，该标识符唯一地标识客户端与服务器之间的连接，而无论源IP地址是什么，即使用户的IP地址发送变化，原始连接ID仍然有效
因为他是基于UDP实现的，不需要先建立连接，这样只需发送一个包含此ID的数据包即可重新创建连接

## QUIC在应用程序空间中实现，而不是操作系统内核中实现
缺点就是当数据在应用程序之前移动时，这通常会由于上下文切换而调用额外的开销。
但是QUIC协议栈旨在由单个应用程序使用，每个应用程序使用QUIC在UDP上托管自己的lianjie
