"""
1. 从数列中挑出一个元素，做为基准值
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在后面，在这个分区退出之后，
该基准就位于数列的中间位置，这个被称为分区操作
3. 递归地把小于基准值元素的子数列和大于基准值的子数列进行排序

从两头交替搜索，直至left和right重合，因此其时间复杂度是O(n)，而整个快排的时间复杂度与划分的趟数有关
理想情况下，每次划分选择的中间数将当前序列几乎等分，经过log2(n)趟划分，最后只剩下一个元素，因此时间复杂度是O(nlog2n)。
最坏的情况下，每次选择的中间数随当前序列的最大或最小元素，也就是说序列本来就是有序的，那么就会退化成o(n^2)的时间复杂度。

"""

```python
def swap(arr, pivot, left):
    arr[pivot], arr[left] = arr[left], arr[pivot]


def partition(arr, start, end):

    # 初始值，空值在最左边
    pivot = start

    # 取出最左侧的基准值
    pivot_value = arr[pivot]

    left = start + 1
    right = end

    while right >= left:

        # 从右边开始逐个对比，直到找到比基准值小的值
        while right >= left and arr[right] >= pivot_value:
            right -= 1

        # 右边找到了一个比基准值小的值，与空值交换
        if right >= left:
            swap(arr, pivot, right)
            pivot = right
            right -= 1

        # 从左边开始逐个对比，直到找到比基准值大的值
        while left <= right and arr[left] <= pivot_value:
            left += 1

        # 左边找到了一个比基准值大的值，与空值交换
        if left <= right:
            swap(arr, pivot, left)
            pivot = left
            left += 1
    return pivot


def quick_sort(arr, start, end):
    index = partition(arr, start, end)
    if index > start:
        quick_sort(arr, start, index - 1)
    if index < end:
        quick_sort(arr, index + 1, end)
    return arr

if __name__ == '__main__':
    arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
    print(arr)
    print(quick_sort(arr, 0, len(arr) - 1))
    print(arr)

```
