
import random
import json

x = [
        [
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6,
            0, 1, 2, 3, 4, 5, 6
        ],
        [
            8, 8, 8, 8, 8, 8, 8,
            9, 9, 9, 9, 9, 9, 9,
            10, 10, 10, 10, 10, 10, 10,
            11, 11, 11, 11, 11, 11, 11,
            12, 12, 12, 12, 12, 12, 12,
            13, 13, 13, 13, 13, 13, 13,
            14, 14, 14, 14, 14, 14, 14,
            15, 15, 15, 15, 15, 15, 15,
            16, 16, 16, 16, 16, 16, 16,
            17, 17, 17, 17, 17, 17, 17,
            18, 18, 18, 18, 18, 18, 18,
            19, 19, 19, 19, 19, 19, 19
        ]
    ]

# for i in range(0, 24):
#     for j in range(0, 7):
#         x[1].append(i)




def generate_random_numbers(rows, columns, min_value=0, max_value=15):
    random_numbers = []
    for _ in range(rows):
        row = [random.uniform(min_value, max_value) for _ in range(columns)]
        for el in row:
            random_numbers.append(el)
    return random_numbers

# Укажите желаемое количество строк и столбцов
rows = 24
columns = 7

random_array = generate_random_numbers(rows, columns)
print(random_array)

output_json = []
for i in range(1, 279):
    output_json.append({
        "id": i,
        "y": generate_random_numbers(rows, columns),
        "x": x
    })

with open('ml_data_office.json', 'w', encoding='utf-8') as output_file:
    json.dump(output_json, output_file, ensure_ascii=False, indent=4)

