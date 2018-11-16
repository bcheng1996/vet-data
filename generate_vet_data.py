import csv
import json

f = open('vet_data.csv')
csv_f = csv.reader(f)

data = {}

#getting titles
count = 0
for row in csv_f:
    data[count] = row
    count+=1

jsondata = json.dumps(data);
print jsondata
