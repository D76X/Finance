
# Q03

I have a cell with this formula 

`=MIN(ARRAY_CONSTRAIN(FILTER($D$363:D, ISNUMBER(IFERROR($D$363:D)), IFERROR($D$363:D) <> 0), 200, 1))`

It computes the MIN among 200 values from `$D$363` down. However, when `insertClosePrice()` runs this formula is changed to 

`=MIN(ARRAY_CONSTRAIN(FILTER($D$364:D, ISNUMBER(IFERROR($D$364:D)), IFERROR($D$364:D) <> 0), 200, 1))`

Therefore Google Sheet automatically updates the formula from using `$D$363` to using `$D$364` any time a new row in insterted by `insertClosePrice()`. This is not what I want. I need the formula that computes the `MIN` to always start at `$D$363` and consider the 200 data points below.

How do I do this?

---

# ANSWER-01-Q03

Google Sheets automatically updates absolute references (like `$D$363`) when a row is inserted above them because it tries to "track" the original cell as it moves down to row 364.

To lock the range so it **always starts at row 363** (capturing your newly inserted row and pushing the rest down), wrap the range in the **`INDIRECT`** function. Text strings inside `INDIRECT` do not shift when rows are inserted.

[INDIRECT](https://support.google.com/docs/answer/3093377?hl=en-GB)  
> Returns a cell reference specified by a string.

## Sample usage
```
INDIRECT('Sheet2!'&B10)
INDIRECT('A2')
INDIRECT('R2C3', FALSE)
```
## Syntax
`INDIRECT(cell_reference_as_string, [is_A1_notation])`

1. `cell_reference_as_string`  
A cell reference, written as a string with surrounding quotation marks.

2. `use_a1_notation – [ OPTIONAL – TRUE by default ]` 
A Boolean indicating whether to use `A1-style notation (TRUE)` or `R1C1-style` notation (FALSE).

---

### The Updated Formula

Replace your formula with this:

```excel
=MIN(ARRAY_CONSTRAIN(FILTER(INDIRECT("D363:D"), ISNUMBER(IFERROR(INDIRECT("D363:D"))), INDIRECT("D363:D") <> 0), 200, 1))

```

### Why this works:

`INDIRECT("D363:D")` evaluates to a range starting at row 363 as a literal text instruction. When `insertClosePrice()` inserts a new row at row 363, the new row takes over position 363, and `INDIRECT` will correctly read from the new row onward without updating to `D364`.

---

# Q02

`A1-style notation` vs. `R1C1-style` notation.

`A1-style notation` is the default cell referencing method in spreadsheet 
software like Microsoft Excel and Google Sheets, where columns are 
identified by letters (A, B, C...) and rows are identified by numbers 
(1, 2, 3...).

Alternatively, `R1C1-style notation` identifies both rows and columns 
by numbers, making it highly useful for programming, macro automation, 
and analyzing relative formulas.

## Quick Comparison

Feature	A1-Style Notation	R1C1-Style Notation
Column Labels	Letters (A, B, C...)	Numbers (C1, C2, C3...)
Row Labels	Numbers (1, 2, 3...)	Numbers (R1, R2, R3...)
Absolute Cell Reference	$A$1	R1C1
Relative Cell Reference	A1 (changes when copied)	R[1]C[1] (offset by row/column)
Best Used For	Everyday spreadsheets, manual data entry	VBA macros, loop programming, pattern auditing

How References Differ

1. Absolute References (Fixed Cells)

• A1 Style: Uses dollar signs ($) to lock the reference.
	• Example: $C$5 always points to column 3, row 5.
• R1C1 Style: Uses straight numbers directly after the letters.
	• Example: R5C3 always points to Row 5, Column 3.

2. Relative References (Offset Cells)

• A1 Style: Changes automatically depending on where you copy and paste the formula.
	• Example: If you are in cell B2 and reference A1, the formula just reads =A1.
• R1C1 Style: Uses square brackets [ ] to indicate how many rows and columns away the target cell is from the current cell.
	• Positive numbers look down or to the right.
	• Negative numbers look up or to the left.
	• No number means the exact same row or column.
	• Example: If you are in cell B2 and want to reference A1 (one row up, one column left), the formula reads =R[-1]C[-1].

Why Choose One Over the Other?

• Choose A1 if: You want standard, readable formulas that most spreadsheet users instantly understand (e.g., =SUM(A1:A10)).
• Choose R1C1 if: You are writing code (like Excel VBA). In R1C1, the formula to add the cell to the left is exactly the same (=RC[-1]) no matter what cell you put it in. This prevents you from having to dynamically calculate column letters in your code.

---

# Q01

I have the formula in Google Sheets "=MIN(U441:U806)". I would like the formula to actually compute the minimum value that it finds starting from U441 to 200 rows below this in the same column. How do I modify this formula to achive this?

To find the minimum value starting from cell **U441** and extending **200 rows** total down the same column (which covers the range **U441** through **U640**), you can update your formula to:

```excel
=MIN(U441:U640)
```

---

# ANSWER-01-Q01

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

