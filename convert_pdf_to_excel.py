import pdfplumber
import pandas as pd
import re

print("Starting script execution...")

pdf_path = "9_School_Block_Information.pdf"
excel_path = "school_block_data.xlsx"

data = []

print(f"Reading {pdf_path}...")

try:
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total Pages: {total_pages}")
        for i, page in enumerate(pdf.pages):
            if i % 10 == 0:
                print(f"Processing page {i+1}/{total_pages}...")
            tables = page.extract_tables()
            for table in tables:
                # Based on analysis, table rows might be like: [S.No, District, Block Name, Block Code]
                # We need to filter out headers and empty rows
                for row in table:
                    # Basic cleaning: remove None and strip whitespace
                    cleaned_row = [str(cell).strip() if cell else "" for cell in row]
                    
                    # Heuristic to identify data rows:
                    # 1. Should have at least 3 columns (District, Block, Code)
                    # 2. First column might be a number (S.No) or District Name
                    
                    if len(cleaned_row) >= 3:
                        # Skip header rows - usually contain "District" or "Block"
                        if "District" in cleaned_row[1] or "Block" in cleaned_row[2]:
                            continue
                        
                        # Assuming structure: [S.No, District, Block Name, Block Code/UDISE]
                        # Sometimes District is merged, so we might need to handle forward fill later or rely on the PDF structure
                        # For this specific PDF, let's just grab the row data.
                        # Adjust indices based on visual inspection of the table output from analysis
                        
                        # Let's try to map generic columns. 
                        # We'll save everything valid and clean in pandas.
                        data.append(cleaned_row)

    if data:
        # Create DataFrame
        # We don't know exact column headers from the raw code without more analysis, 
        # but let's assume standard headers based on the file name.
        # We'll name them Col1, Col2, Col3, Col4 etc. and refine.
        
        # However, looking at standard Educational PDFs:
        # Col 0: S.No
        # Col 1: District
        # Col 2: Block Name
        # Col 3: Block Code / UDISE Code
        
        # Let's inspect the first row of data to be sure, but for now we write blindly to Excel
        # so the user can verify/edit.
        
        df = pd.DataFrame(data)
        
        # Renaissance cleanup: Remove rows that are clearly page numbers or footers
        df = df[df.iloc[:, 0] != ""] 
        
        print(f"Extracted {len(df)} rows.")
        df.to_excel(excel_path, index=False, header=False)
        print(f"Successfully saved to {excel_path}")
        
    else:
        print("No data extracted.")

except Exception as e:
    print(f"Error converting PDF: {e}")
