def select(arr: list):
    result = []
    count = len(arr)
    for _ in range(count):
        min_ele = min(arr)
        result.append(min_ele)
        arr.remove(min_ele)
    return result


if __name__ == '__main__':
    arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
    print(select(arr))