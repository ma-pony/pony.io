"""
写一个函数, 把网址里的图片（选择最好的方式）多进程或多线程（请选正确的）把每张图片的档案的大小(byte为单位）加起来。展示出来。

如果有重复的图片，或不是图片的链接资源要过滤掉
图片不要保存在本地系统档案里。

"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import urlopen, Request


url_list_input = [
 "https://miro.medium.com/max/700/0*8aY8pX5CoNGImZU4.png",
 "https://img-a.udemycdn.com/course/240x135/2150122_6aae_3.jpg",
 "http://www.w3big.com/python3/python3.png",
 "http://www.w3big.com/python3/python3.png",
 "https://baidu.com/",
 "https://udemycoupons.me/wp-content/uploads/2019/11/Udemy-Coupons-Comprehensive-Python3-Bootcamp-2020-From-A-to-Expert-100-OFF-696x436.jpg"
]

# 这里不支持网络下载所以可以用自己的编辑器完成，我们会再做代码验证

extends = ["png", "jpg"]
hash_dict = {}
POOL_SIZE = 20


def is_image_link(link):
    extend = link.split(".")[-1]
    return True if extend in extends else False


def not_deplicate_link(link):
    hash_value = hash(link)
    if hash_value in hash_dict and link == hash_dict[hash_value]:
        return True
    hash_dict[hash_value] = link
    return False


def request(url, timeout):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11"})
    with urlopen(req, timeout=timeout) as conn:
        return conn.headers


def sum_image_size():
    size = 0
    with ThreadPoolExecutor(max_workers=POOL_SIZE) as executor:
        future_to_url = {executor.submit(request, url, 60): url for url in url_list_input if is_image_link(url) and not_deplicate_link(url)}
        for future in as_completed(future_to_url):
            res = future.result()
            size += int(res["Content-Length"])
    return size


if __name__ == '__main__':
    print(sum_image_size())
