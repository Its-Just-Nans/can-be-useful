Objective:
Your task is to code a function to find all the companies whose transactions have followed a recurrent pattern in the given list of transactions.


In this case, we consider a recurrent pattern as being a sequence of at least 3 transactions separated by the same number of months.


Examples:

1 transaction in January, 1 transaction in February, 1 transaction in March: recurrent pattern with a 1-month interval
1 transaction in January, 1 transaction in April, 1 transaction in July: recurrent pattern with a 3-months interval
1 transaction in January, 1 transaction in April, 1 transaction in August: no recurrent pattern, as the intervals of time are 3 months then 4 months.
1 transaction in January, 1 transaction in April, 1 transaction in May, 1 transaction in July: recurrent pattern with a 3-months interval (the May transaction is ignored)

There are multiple solutions to this problem, don't forget that your execution time will be registered!


Input:
Simplified version of the transactions registry, presented as a list of tuples. Each tuple has 3 components, in the following order:

the selling company ID (as a string)
the selling company name (as a string)
the date of the transaction (with only the month and year, as a string)

Expected output:
List ids of company IDs belonging to companies which present a recurrent pattern in the data.