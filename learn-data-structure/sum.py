from typing import List


def back(candidates: List[int], start: int, size: int, path: List[int], res: List[list], target_sum: int):
    if target_sum < 0:
        return
    elif target_sum == 0:
        res.append(path)
        return
    else:
        for index in range(start, size):
            current_node = candidates[index]
            current_sum = target_sum - current_node
            back(candidates, index, size, path + [candidates[index]], res, current_sum)


def combination_sum(candidates: List[int], target: int):
    res = []
    path = []
    size = len(candidates)
    if size != 0:
        back(candidates, 0, size, path, res, target)

    return res


if __name__ == '__main__':
    print(combination_sum([2, 3, 5, 6, 8], 8))


