
parts = 10
total_rows = 0
with open('../res/words.txt') as big_file:
    for row in big_file:
        total_rows += 1
block_size = int(total_rows / parts)
with open('../res/words.txt') as big_file:
    current_line_count = 0
    part_file = None
    for line in big_file:
        if (current_line_count % block_size) == 0 or part_file is None:
            print('opening new')
            part_file = open('../res/parts/part' + str(int(current_line_count / block_size)) + '.txt', 'w+')
        part_file.write(line)
        current_line_count += 1
