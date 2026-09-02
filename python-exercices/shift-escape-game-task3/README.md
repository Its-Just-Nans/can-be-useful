Instructions
Objective:
Code a function to find the parent company which received the highest amount of money within the biggest component of the network of suspicious companies.
This means that the company needs:

to be connected to the highest number of other parent companies, directly or indirectly through other parent companies
to have received the highest amount of money within this group

Important note: transactions can be registered between different branches of a parent company. In this case the transaction will be shown in the data as being made from the company to itself, and the amount of money should not be taken into account.

Input:
Simplified version of the dataframe data of lunar transactions with:

selling company ID
selling company name
buying company ID
buying company name
total amount of money sent from buyer to seller.

Expected output:
id, the ID of the parent company which received the highest amount of money while being connected to the highest number of companies.