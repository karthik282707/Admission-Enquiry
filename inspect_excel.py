import pandas as pd

# Read Excel file
df = pd.read_excel('school_block_data.xlsx', header=None)

print("Total columns:", len(df.columns))
print("\nColumn headers (first row):")
for i in range(len(df.columns)):
    print(f"Column {i}: {df.iloc[0, i]}")

print("\n\nFirst 5 data rows:")
print(df.head(6))
