---
title: Divide two integers
subtitle: 给定两个整数 a 和 b ，求它们的除法的商 a/b ，要求不得使用乘号 '*'、除号 '/' 以及求余符号 '%' 。
slug: int-divide
tags: python3, python 

/* You can find the list of tags here https://github.com/Hashnode/support/blob/main/misc/tags.json
You need to upload your image to https://hashnode.com/uploader 
and use the uploaded image URL as COVER_IMAGE_URL */ 

cover: https://cdn.hashnode.com/res/hashnode/image/unsplash/PbzntH58GLQ/upload/v1653831013147/Tie1TT8RA.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress
domain: pony.hashnode.dev
---

给定两个整数 a 和 b ，求它们的除法的商 a/b ，要求不得使用乘号 '*'、除号 '/' 以及求余符号 '%'。

注意：

整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2
假设我们的环境只能存储 32 位有符号整数，其数值范围是 [−2^31, 2^31−1]。本题中，如果除法结果溢出，则返回 2^31− 1

示例 1：

输入：a = 15, b = 2
输出：7
解释：15/2 = truncate(7.5) = 7
示例 2：

输入：a = 7, b = -3
输出：-2
解释：7/-3 = truncate(-2.33333..) = -2
示例 3：

输入：a = 0, b = 1
输出：0
示例 4：

输入：a = 1, b = 1
输出：1


提示:

-2^31 <= a, b <= 231 - 1
b != 0


来源：力扣（LeetCode）
链接：https://leetcode.cn/problems/xoh6Oh
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


1. 乘法可以通过加法来实现，除法可以通过减法来实现

16 - 3 = 13
13 - 3 = 10
10 - 3 = 7
7 - 3 = 4
4 - 3 = 1
1 - 3 = -2

大致代码如下
```python
result = 0
a = 16
b = 3
while a > b:
    a-= b
    result += 1
```
这样的复杂度较高，O(n)
2. 试着进行优化
尝试减去除数的倍数
a = 16, b = 3
  16 - 3 = 13                    k1 = 1
  16 - (3 + 3) = 10              k1= (1+1) = 2 
  16 - (6 + 6) = 4               k1 = (2+2) = 4
  16 - (12 + 12) = -8            小于0，不计入

a = 4, b = 3
  4 - 3 = 1                      k2 = 1
  4 - (3 + 3) = -2               小于0，不计入   

a = 1, b = 3
  1 - 3 = -2

实际结果就是k1+k2=5

大致代码如下
```python
result = 0
a = -16
b = -3
while a <= b:
    value = b
    k = 1
    while a - value <= value:
        value += value
        k += k
    a -= value
    result += k
```
时间复杂度O(logn * logn)

3. 将加法转为位运算<<
a = 16, b = 3
  16 - 3<<0 = 13              k1 = 1<<0 = 1
  16 - 3<<1 = 10              k1 = 1<<1 = 2 
  16 - 3<<2 = 4               k1 = 1<<2 = 4
  16 - 3<<3 = -8              小于0，不计入

a = 4, b = 3
  4 - 3<<0 = 1                k2 = 1<<0 = 1
  4 - 3<<1 = -2               小于0，不计入   

a = 1, b = 3
  1 - 3 = -2                  小于0，不计入   
目前是从最小位开始计算，尝试从最大位开始计算
16 - 3<<31 < 0
...
16 - 3<<2 > 0              k1 = 1<<2 = 4
4 - 3<<1 < 0               
4 - 3<<0 < 0               k2 = 1<<0 = 1

result = k1 + k2 = 5



```python
class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        int_min, int_max = -2**31, 2**31 - 1
        if dividend == 0:
            return 0
        if divisor == 1:
            return dividend
        if divisor == -1:
            if dividend > int_min:
                return -dividend
            else:
                return int_max
        # 考虑被除数为最小值的情况
        if dividend == int_min:
            if divisor == 1:
                return int_min
            if divisor == -1:
                return int_max

        # 除数为最小值时
        if divisor == int_min:
            if dividend == int_min:
                return 1
            else:
                return 0

        # 一般情况，使用类二分法
        # 将所有的正数取相反数，这样就只需要考虑一种情况
        reverse = False if (dividend > 0) ^ (divisor > 0) else True

        """
        以dividend=16和divisor=3为例，
        则candidates为[3, 6]
        16 <= 3 + 3
        16 <= 6 + 6
        16 <= 12 + 12
        
        """
        result = 0
        dividend, divisor = abs(dividend), abs(divisor)
        for i in range(31, -1, -1):
            if (dividend >> i) - divisor >= 0:
                dividend = dividend - (divisor << i)
                if result > int_max - (1 << i):
                    return int_max
                result += 1 << i
        return result if reverse else -result


if __name__ == '__main__':
    s = Solution()
    print(s.divide(7, -3))
    print(s.divide(15, 2))
```
