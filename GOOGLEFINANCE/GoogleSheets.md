# I have the formula in Google Sheets "=MIN(U441:U806)". I would like the formula to actually compute the minimum value that it finds starting from U441 to 200 rows below this in the same column. How do I modify this formula to achive this?

To find the minimum value starting from cell **U441** and extending **200 rows** total down the same column (which covers the range **U441** through **U640**), you can update your formula to:

```excel
=MIN(U441:U640)

```

### Dynamic Options

If you want a formula that automatically calculates the range based on cell **U441** and a row length of **200**, you can use one of the following dynamic approaches:

1. **Using `OFFSET`:**
```excel
=MIN(OFFSET(U441, 0, 0, 200, 1))

```


*Explanation:* `OFFSET(U441, 0, 0, 200, 1)` creates a range starting at `U441`, shifting 0 rows and 0 columns, with a height of `200` rows and a width of `1` column.
2. **Using `INDEX`:**
```excel
=MIN(U441:INDEX(U:U, ROW(U441) + 200 - 1))

```


*Explanation:* `ROW(U441) + 200 - 1` calculates row `640`, making the range `U441:U640` dynamically without using volatile functions like `OFFSET`.

---