"""
给定两个整数 a 和 b ，求它们的除法的商 a/b ，要求不得使用乘号 '*'、除号 '/' 以及求余符号 '%'。

注意：

整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2
假设我们的环境只能存储 32 位有符号整数，其数值范围是 [−2^31, 2^31−1]。本题中，如果除法结果溢出，则返回 2^31− 1

"""


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

        # rev = False
        # if dividend > 0:
        #     dividend = -dividend
        #     rev = not rev
        # if divisor > 0:
        #     divisor = -divisor
        #     rev = not rev
        #
        # candidates = [divisor]
        # # 注意溢出
        # while candidates[-1] >= dividend - candidates[-1]:
        #     candidates.append(candidates[-1] + candidates[-1])
        #
        # ans = 0
        # for i in range(len(candidates) - 1, -1, -1):
        #     if candidates[i] >= dividend:
        #         ans += (1 << i)
        #         dividend -= candidates[i]
        #
        # return -ans if rev else ans
        
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
    print(s.divide(16, -3))
