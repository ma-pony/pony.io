

def partition(arr, start, end):
    """
    :param arr:
    :param start:
    :param end:
    :return:
    """
    pivot = start

    pivot_value = arr[pivot]

    left = start + 1
    right = end

    while right >= left:

        # 从右边开始逐个对比，直到找到比基准值小的值
        while right >= left and arr[right] >= pivot_value:
            right -= 1

        # 右边找到一个比基准值小的值，比空值交换
        if right >= left:
            arr[pivot], arr[right] = arr[right], arr[pivot]
            pivot = right
            right -= 1

        # 从左边开始逐个对比，直到找到比基准值大的值
        while left <= right and arr[left] <= pivot_value:
            left += 1

        # 左边找到一个比基准值大的值，与空值交换
        if left <= right:
            arr[pivot], arr[left] = arr[left], arr[pivot]
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


def quick(arr):
    if len(arr) < 2:
        return arr

    left_arr, right_arr = [], []
    pivot = arr[0]

    for i in arr[1:]:
        if i < pivot:
            left_arr.append(i)
        else:
            right_arr.append(i)

    return quick(left_arr) + [pivot] + quick(right_arr)


if __name__ == '__main__':
    arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
    print(quick_sort(arr, 0, len(arr) - 1))
    print(quick(arr))
